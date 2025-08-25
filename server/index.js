// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Respcnt = require("./models/respcnt");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const csv = require("fast-csv");
const app = express();
const path = require("path");

const upload = multer({ dest: "uploads/" });
// ...existing code...


// Middleware
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());


// ✅ Connect to MongoDB
mongoose.connect("mongodb://neuralnet:NNetBlr@mongodb.nnet-dataviz.com:27017/rccs?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Simple test route
// app.get("/", (req, res) => {
//   res.send("Server is running & MongoDB is connected!");
// });


// Schema
// Use the correct collection for targets
const TargetSchema = new mongoose.Schema({}, { strict: false });
const Target = mongoose.model("rccs_target", TargetSchema, "rccs_target");
const Achieved1 = mongoose.model("rccs10", TargetSchema, "rccs10");       // RCCS10 collection
// (last param ensures it uses the collection "RCCS10")

// Serve static files from dist
// app.use(express.static(path.join(__dirname, "dist")));




// API
app.get("/get-data", async (req, res) => {
  try {
    const results = await Achieved1.find({})
      .sort({ Form_No: 1 })
      .lean(); // lean() makes it faster, returns plain JS objects

    res.json(results);
  } catch (err) {
    console.error("Database Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});




// API to get data with aggregation
app.get("/get-datafw", async (req, res) => {
        try {
          const results = await Target.aggregate([
            // Ensure Target is never null (default to 0)
            {
              $addFields: {
                Target: { $ifNull: ["$Target", 0] }
              }
            },
            {
              $lookup: {
                from: "rccs10",         // achieved data collection
                localField: "Centre",   // field from target collection
                foreignField: "FO",     // field from achieved collection
                as: "achievedDocs"
              }
            },
            {
              $addFields: {
                Target: { $toInt: { $ifNull: ["$Target", 0] } }
              }
            },
            // Lookup matching docs from rccs10 on Centre = FO
            {
              $lookup: {
                from: "rccs10",
                localField: "Centre",
                foreignField: "FO",
                as: "achievedDocs"
              }
            },
            // Calculate Achieved count, Pending count, and percentages with proper casting
            {
              $addFields: {
                Achieved: { $size: "$achievedDocs" },
                PendingCount: { $subtract: ["$Target", { $size: "$achievedDocs" }] },
                TargetAchievedPercentage: {
                  $cond: [
                    { $eq: ["$Target", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: [{ $toInt: { $size: "$achievedDocs" } }, "$Target"] },
                            100
                          ]
                        },
                        0
                      ]
                    }
                  ]
                },
                PendingPercentage: {
                  $cond: [
                    { $eq: ["$Target", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: [{ $toInt: { $subtract: ["$Target", { $size: "$achievedDocs" }] } }, "$Target"] },
                            100
                          ]
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            },
            // Facet to get per-centre and total aggregates
            {
              $facet: {
                perCentre: [{ $sort: { Centre: 1 } }],
                totals: [
                  {
                    $group: {
                      _id: null,
                      TotalTargetCount: { $sum: "$Target" },
                      TotalAchievedCount: { $sum: "$Achieved" }
                    }
                  },
                  {
                    $addFields: {
                      OverallPercentage: {
                        $cond: [
                          { $eq: ["$TotalTargetCount", 0] },
                          0,
                          {
                            $round: [
                              {
                                $multiply: [
                                  { $divide: ["$TotalAchievedCount", "$TotalTargetCount"] },
                                  100
                                ]
                              },
                              0
                            ]
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            },
            // Merge total fields into each perCentre document
            {
              $project: {
                data: {
                  $map: {
                    input: "$perCentre",
                    as: "c",
                    in: {
                      $mergeObjects: [
                        "$$c",
                        {
                          TotalTargetCount: { $arrayElemAt: ["$totals.TotalTargetCount", 0] },
                          TotalAchievedCount: { $arrayElemAt: ["$totals.TotalAchievedCount", 0] },
                          OverallPercentage: { $arrayElemAt: ["$totals.OverallPercentage", 0] }
                        }
                      ]
                    }
                  }
                }
              }
            },
            { $unwind: "$data" },
            { $replaceRoot: { newRoot: "$data" } }
          ]).exec();
          res.json(results);
        } catch (err) {
          console.error("Database Query Error:", err);
          res.status(500).json({ error: err.message });
        }
});

const Achieved = mongoose.model("rccs10", TargetSchema, "rccs10");       // RCCS10 collection

function sanitizeDoc(doc) {
  const result = {};
  for (const key in doc) {
    const value = doc[key];

    if (value == null) {
      result[key] = value;
    } else if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
      result[key] = value;
    } else if (typeof value.toNumber === "function") {
      result[key] = value.toNumber(); // Convert BSON Long
    } else if (typeof value === "object" && "low" in value && "high" in value) {
      // Manually reconstruct Long
      result[key] = value.low + value.high * 4294967296;
    } else if (Array.isArray(value)) {
      result[key] = value.map(sanitizeDoc);
    } else if (typeof value === "object") {
      result[key] = sanitizeDoc(value); // Recursive for nested objects
    } else {
      result[key] = value;
    }
  }
  return result;
}
//UID page
app.get("/get-datauid", async (req, res) => {
  try {
    const results = await Achieved.aggregate([
      {
        $group: {
          _id: {
            UID: "$UID",
            Centre: "$FO",
            Investigator: "$IV_Name"
          },
          Achieved: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "UID_data",
          localField: "_id.UID",
          foreignField: "uid",
          as: "uidInfo"
        }
      },
      { $unwind: "$uidInfo" },
      {
        $addFields: {
          Target: { $ifNull: ["$uidInfo.target", 0] },
          Difference: { $subtract: [{ $ifNull: ["$uidInfo.target", 0] }, "$Achieved"] },
          IndividualPercentage: {
            $cond: [
              { $eq: [{ $ifNull: ["$uidInfo.target", 0] }, 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$Achieved", { $ifNull: ["$uidInfo.target", 1] }] },
                      100
                    ]
                  },
                  0
                ]
              }
            ]
          }
        }
      },
      {
        $facet: {
          perUID: [
            {
              $project: {
                Centre: "$_id.Centre",
                UID: "$_id.UID",
                Investigator: "$_id.Investigator",
                Achieved: 1,
                Target: 1,
                Difference: 1,
                IndividualPercentage: 1
              }
            },
            { $sort: { Centre: 1 } }
          ],
          totals: [
            {
              $group: {
                _id: null,
                TotalTargetCount: { $sum: "$Target" },
                TotalAchievedCount: { $sum: "$Achieved" }
              }
            },
            {
              $addFields: {
                OverallPercentage: {
                  $cond: [
                    { $eq: ["$TotalTargetCount", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ["$TotalAchievedCount", "$TotalTargetCount"] },
                            100
                          ]
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            }
          ]
        }
      },
      {
        $project: {
          data: {
            $map: {
              input: "$perUID",
              as: "c",
              in: {
                $mergeObjects: [
                  "$$c",
                  {
                    TotalTargetCount: { $arrayElemAt: ["$totals.TotalTargetCount", 0] },
                    TotalAchievedCount: { $arrayElemAt: ["$totals.TotalAchievedCount", 0] },
                    OverallPercentage: { $arrayElemAt: ["$totals.OverallPercentage", 0] }
                  }
                ]
              }
            }
          }
        }
      },
      { $unwind: "$data" },
      { $replaceRoot: { newRoot: "$data" } }
    ]);

    // 🔥 Clean BSON Long → Numbers for React
    const cleanedResults = results.map(sanitizeDoc);

    res.json(cleanedResults);
  } catch (err) {
    console.error("Error in aggregation:", err);
    res.status(500).json({ error: err.message });
  }
});
// filtered data for UID
app.get("/centres", async (req, res) => {
  try {
    const results = await Achieved.aggregate([
      {
        $group: {
          _id: "$FO"   // distinct FO values
        }
      },
      {
        $project: {
          label: "$_id",
          _id: 0
        }
      },
      { $sort: { label: 1 } } // optional: sort alphabetically
    ]);

    // Build the response like in your MySQL code
    const options = [
      { value: "All", label: "All" },
      ...results.map(row => ({
        value: row.label,
        label: row.label
      }))
    ];

    res.json(options);
  } catch (err) {
    console.error("Error fetching centres:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/gender", async (req, res) => {
  try {
    const results = await Achieved.aggregate([
      {
        $group: {
          _id: "$Gender"   // distinct Gender values
        }
      },
      {
        $project: {
          label: "$_id",
          _id: 0
        }
      },
      { $sort: { label: 1 } } // optional: sort alphabetically
    ]);

    // Build response with "All" option
    const options = [
      { value: "All", label: "All" },
      ...results.map(row => ({
        value: row.label,
        label: row.label
      }))
    ];

    res.json(options);
  } catch (err) {
    console.error("Error fetching gender options:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/age_range", async (req, res) => {
  try {
    const results = await Achieved.aggregate([
      {
        $group: {
          _id: "$Age_Range"   // distinct Gender values
        }
      },
      {
        $project: {
          label: "$_id",
          _id: 0
        }
      },
      { $sort: { label: 1 } } // optional: sort alphabetically
    ]);

    // Build response with "All" option
    const options = [
      { value: "All", label: "All" },
      ...results.map(row => ({
        value: row.label,
        label: row.label
      }))
    ];

    res.json(options);
  } catch (err) {
    console.error("Error fetching gender options:", err);
    res.status(500).json({ error: err.message });
  }
});

// end of filtered data for UID

// chart1
app.get("/pro1", async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    // Convert query params to arrays
    let centreList = centres ? centres.split(",").map(c => c.trim()) : [];
    let genderList = genders ? genders.split(",").map(g => g.trim()) : [];
    let ageList = ages ? ages.split(",").map(a => a.trim()) : [];

    // "All" logic
    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Build filter object
    const filter = { Q1_2: { $ne: null } };

    if (centreList.length > 0) filter.FO = { $in: centreList };
    if (genderList.length > 0) filter.Gender = { $in: genderList };
    if (ageList.length > 0) filter.Age_Range = { $in: ageList };

    // Run aggregation
    const results = await Achieved.aggregate([
      { $match: filter },  // apply filters

      {
        $facet: {
          base: [
            { $count: "base_count" } // equivalent of base_counts CTE
          ],
          grouped: [
            {
              $group: {
                _id: "$Gender",
                Gender_Count: { $sum: 1 }
              }
            },
            { $sort: { _id: -1 } } // ORDER BY Gender DESC
          ]
        }
      },
      {
        $project: {
          base: { $arrayElemAt: ["$base.base_count", 0] },
          grouped: 1
        }
      },
      { $unwind: "$grouped" },
      {
        $project: {
          Gender: "$grouped._id",
          Gender_Count: "$grouped.Gender_Count",
          Gender_Percentage: {
            $round: [
              {
                $cond: [
                  { $gt: ["$base", 0] },
                  { $multiply: [{ $divide: ["$grouped.Gender_Count", "$base"] }, 100] },
                  0
                ]
              },
              0
            ]
          }
        }
      }
    ]);

    // Transform into object (like in your SQL version)
    const genderData = {};
    results.forEach(row => {
      genderData[row.Gender] = {
        Gender_Count: row.Gender_Count,
        Gender_Percentage: row.Gender_Percentage
      };
    });

    res.json(genderData);
  } catch (err) {
    console.error("MongoDB Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// chart2
// ✅ MongoDB version of /pro2 (Age_Range analysis)
app.get("/pro2", async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    // Convert query params to arrays
    let centreList = centres ? centres.split(",").map(c => c.trim()) : [];
    let genderList = genders ? genders.split(",").map(g => g.trim()) : [];
    let ageList = ages ? ages.split(",").map(a => a.trim()) : [];

    // "All" logic
    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Build filter
    const filter = { Q1_2: { $ne: null } };
    if (centreList.length > 0) filter.FO = { $in: centreList };
    if (genderList.length > 0) filter.Gender = { $in: genderList };
    if (ageList.length > 0) filter.Age_Range = { $in: ageList };

    // Run aggregation
    const results = await Achieved.aggregate([
      { $match: filter },  // apply filters

      {
        $facet: {
          base: [
            { $count: "base_count" } // base count like SQL CTE
          ],
          grouped: [
            {
              $group: {
                _id: "$Age_Range",
                Age_Range_Count: { $sum: 1 }
              }
            },
            { $sort: { _id: -1 } } // ORDER BY Age_Range DESC
          ]
        }
      },
      {
        $project: {
          base: { $arrayElemAt: ["$base.base_count", 0] },
          grouped: 1
        }
      },
      { $unwind: "$grouped" },
      {
        $project: {
          Age_Range: "$grouped._id",
          Age_Range_Count: "$grouped.Age_Range_Count",
          Age_Range_Percentage: {
            $round: [
              {
                $cond: [
                  { $gt: ["$base", 0] },
                  { $multiply: [{ $divide: ["$grouped.Age_Range_Count", "$base"] }, 100] },
                  0
                ]
              },
              0
            ]
          }
        }
      }
    ]);

    // Transform into key-based object (like in PHP/MySQL version)
    const AgeData = {};
    results.forEach(row => {
      AgeData[row.Age_Range] = {
        Age_Range_Count: row.Age_Range_Count,
        Age_Range_Percentage: row.Age_Range_Percentage
      };
    });

    res.json(AgeData);
  } catch (err) {
    console.error("MongoDB Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// chart3
// ✅ MongoDB version of /pro3
app.get('/pro3', async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    // Convert to arrays
    let centreList = centres ? centres.split(',').map(c => c.trim()) : [];
    let genderList = genders ? genders.split(',').map(g => g.trim()) : [];
    let ageList = ages ? ages.split(',').map(a => a.trim()) : [];

    // "All" logic
    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Build match filter
    const match = { Q1_2: { $ne: null } };
    if (centreList.length > 0) match.FO = { $in: centreList };
    if (genderList.length > 0) match.Gender = { $in: genderList };
    if (ageList.length > 0) match.Age_Range = { $in: ageList };

    // Run aggregation
    const results = await Achieved.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$Edu_Quali",
          Edu_Quali_Count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Edu_Quali_Count" },
          data: { $push: "$$ROOT" }
        }
      },
      { $unwind: "$data" },
      {
        $project: {
          Edu_Quali: "$data._id",
          Edu_Quali_Count: "$data.Edu_Quali_Count",
          Edu_Quali_Percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$data.Edu_Quali_Count", "$total"] },
                  100
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { Edu_Quali: -1 } }
    ]);

    // ✨ Transform results to object (like PHP version)
    const EduData = {};
    results.forEach(row => {
      EduData[row.Edu_Quali] = {
        Edu_Quali_Count: row.Edu_Quali_Count,
        Edu_Quali_Percentage: row.Edu_Quali_Percentage
      };
    });

    res.json(EduData);

  } catch (err) {
    console.error("Mongo Query Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// chart4
// ✅ MongoDB version of /pro4
app.get('/pro4', async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    // Convert to arrays
    let centreList = centres ? centres.split(',').map(c => c.trim()) : [];
    let genderList = genders ? genders.split(',').map(g => g.trim()) : [];
    let ageList = ages ? ages.split(',').map(a => a.trim()) : [];

    // "All" logic → ignore filter
    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // ✅ Build dynamic filter
    const filter = { Q1_2: { $ne: null } };
    if (centreList.length > 0) filter.FO = { $in: centreList };
    if (genderList.length > 0) filter.Gender = { $in: genderList };
    if (ageList.length > 0) filter.Age_Range = { $in: ageList };

    // ✅ Mongo aggregation
    const results = await Achieved.aggregate([
      { $match: filter },
      {
        $facet: {
          base: [{ $count: "base_count" }],
          grouped: [
            { $group: { _id: "$FAMILY_MEM", Fam_Count: { $sum: 1 } } },
            { $sort: { Fam_Count: 1 } } // ascending
          ]
        }
      },
      {
        $project: {
          base_count: { $arrayElemAt: ["$base.base_count", 0] },
          grouped: 1
        }
      },
      { $unwind: "$grouped" },
      {
        $project: {
          Fam: "$grouped._id",
          Fam_Count: "$grouped.Fam_Count",
          Fam_Percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$grouped.Fam_Count", "$base_count"] },
                  100
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { Fam_Percentage: 1 } } // ascending order
    ]);

    // ✨ Transform like PHP key-based object
    const FamData = {};
    results.forEach(row => {
      FamData[row.Fam] = {
        Fam_Count: row.Fam_Count,
        Fam_Percentage: row.Fam_Percentage
      };
    });

    res.json(FamData);
  } catch (err) {
    console.error("Mongo Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});


//chart5
//  const results = await Achieved.aggregate([
app.get('/pro5', async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    // Convert to array and clean inputs
    let centreList = centres ? centres.split(',').map(c => c.trim()) : [];
    let genderList = genders ? genders.split(',').map(g => g.trim()) : [];
    let ageList = ages ? ages.split(',').map(a => a.trim()) : [];

    // "All" logic: if 'All' is selected, ignore that filter completely
    if (centreList.includes('All')) centreList = [];
    if (genderList.includes('All')) genderList = [];
    if (ageList.includes('All')) ageList = [];

    // Build MongoDB filter
    const matchStage = { Q1_2: { $ne: null } };
    if (centreList.length > 0) matchStage.FO = { $in: centreList };
    if (genderList.length > 0) matchStage.Gender = { $in: genderList };
    if (ageList.length > 0) matchStage.Age_Range = { $in: ageList };

    // Run aggregation
    const results = await Achieved.aggregate([
      { $match: matchStage },

      {
        $facet: {
          base: [{ $count: "base_count" }],
          grouped: [
            {
              $group: {
                _id: {
                  $concat: [
                    { $toUpper: { $substrCP: ["$Occ", 0, 1] } },
                    { $toLower: { $substrCP: ["$Occ", 1, { $strLenCP: "$Occ" }] } }
                  ]
                },
                Occ_Count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      },
      {
        $project: {
          base: { $arrayElemAt: ["$base.base_count", 0] },
          grouped: 1
        }
      },
      { $unwind: "$grouped" },
      {
        $project: {
          Occ: "$grouped._id",
          Occ_Count: "$grouped.Occ_Count",
          Occ_Percentage: {
            $round: [
              {
                $cond: [
                  { $gt: ["$base", 0] },
                  { $multiply: [{ $divide: ["$grouped.Occ_Count", "$base"] }, 100] },
                  0
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { Occ_Percentage: 1 } }
    ]);

    res.json(results);

  } catch (err) {
    console.error("MongoDB Query Error:", err.message || err);
    res.status(500).json({ error: err.message || err });
  }
});


//Chart6
// ✅ MongoDB version of /pro6
app.get("/pro6", async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    let centreList = centres ? centres.split(",").map(c => c.trim()) : [];
    let genderList = genders ? genders.split(",").map(g => g.trim()) : [];
    let ageList = ages ? ages.split(",").map(a => a.trim()) : [];

    // "All" logic: ignore that filter
    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Build filter
    const match = { Q1_2: { $ne: null } };

    if (centreList.length > 0) match.FO = { $in: centreList };
    if (genderList.length > 0) match.Gender = { $in: genderList };
    if (ageList.length > 0) match.Age_Range = { $in: ageList };

    // Aggregation pipeline
    const pipeline = [
      { $match: match },
      {
        $facet: {
          base: [{ $count: "base_count" }],
          data: [
            {
              $group: {
                _id: "$Income",
                count: { $sum: 1 }
              }
            }
          ]
        }
      },
      {
        $project: {
          base_count: { $arrayElemAt: ["$base.base_count", 0] },
          data: 1
        }
      },
      { $unwind: "$data" },
      {
        $project: {
          name: "$data._id",
          count: "$data.count",
          value: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$data.count", { $ifNull: ["$base_count", 1] }] },
                  100
                ]
              },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$name", "Less than Rs. 5 thousand"] }, then: 1 },
                { case: { $eq: ["$name", "Rs. 5 thousand - Less than Rs. 10 thousand"] }, then: 2 },
                { case: { $eq: ["$name", "Rs. 10 thousand - Less than Rs. 25 thousand"] }, then: 3 },
                { case: { $eq: ["$name", "Rs. 25 thousand - Less than Rs. 50 thousand"] }, then: 4 },
                { case: { $eq: ["$name", "Rs. 50 thousand - Less than Rs. 1 lakh"] }, then: 5 },
                { case: { $eq: ["$name", "Rs 1 lakh and above"] }, then: 6 }
              ],
              default: 7
            }
          }
        }
      },
      { $sort: { sortOrder: 1 } },
      { $project: { sortOrder: 0 } }
    ];

    const results = await Achieved.aggregate(pipeline);

    res.json(results);
  } catch (err) {
    console.error("Mongoose /pro6 Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


//chart7
app.get("/pro7", async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    // Convert to array and clean inputs
    let centreList = centres ? centres.split(",").map(c => c.trim()) : [];
    let genderList = genders ? genders.split(",").map(g => g.trim()) : [];
    let ageList = ages ? ages.split(",").map(a => a.trim()) : [];

    // "All" logic: if 'All' is selected, ignore that filter
    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Build Mongo match filter
    const match = { Q1_2: { $ne: null } };

    if (centreList.length > 0) match.FO = { $in: centreList };
    if (genderList.length > 0) match.Gender = { $in: genderList };
    if (ageList.length > 0) match.Age_Range = { $in: ageList };

    // Run aggregation
    const results = await Achieved.aggregate([
      { $match: match },
      { $count: "total_count" }
    ]);

    res.json(results);
  } catch (err) {
    console.error("Mongo /pro7 Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//chart8
app.get('/pro8', async (req, res) => {
  try {
    const { centres, genders, ages } = req.query;

    let centreList = centres ? centres.split(',').map(c => c.trim()) : [];
    let genderList = genders ? genders.split(',').map(g => g.trim()) : [];
    let ageList = ages ? ages.split(',').map(a => a.trim()) : [];

    if (centreList.includes('All')) centreList = [];
    if (genderList.includes('All')) genderList = [];
    if (ageList.includes('All')) ageList = [];

    const matchStage = { Q1_2: { $ne: null } };
    if (centreList.length > 0) matchStage.FO = { $in: centreList };
    if (genderList.length > 0) matchStage.Gender = { $in: genderList };
    if (ageList.length > 0) matchStage.Age_Range = { $in: ageList };

    const results = await Achieved.aggregate([
      // Join rccs10 with Pro_data
      {
        $lookup: {
          from: "Pro_data",         // 👈 join with Pro_data
          localField: "Income",     // 👈 field in rccs10
          foreignField: "Labels",   // 👈 field in Pro_data
          as: "joined"
        }
      },
      { $unwind: { path: "$joined", preserveNullAndEmptyArrays: true } },

      // Group by Label & Weight
      {
        $group: {
          _id: { name: "$joined.Labels", weight: "$joined.Weights" },
          count: { $sum: 1 }
        }
      },

      // Compute weighted contribution
      {
        $project: {
          name: "$_id.name",
          weight: "$_id.weight",
          count: 1,
          weightedValue: { $multiply: ["$_id.weight", "$count"] }
        }
      },

      // Collect rows + compute totals
      {
        $group: {
          _id: null,
          rows: { $push: "$$ROOT" },
          totalWeighted: { $sum: "$weightedValue" },
          totalCount: { $sum: "$count" }
        }
      },

      // Compute overall average
      {
        $project: {
          rows: 1,
          Average: {
            $cond: [
              { $gt: ["$totalCount", 0] },
              { $round: [{ $divide: ["$totalWeighted", "$totalCount"] }, 0] },
              0
            ]
          }
        }
      },

      // Expand rows back
      { $unwind: "$rows" },
      {
        $project: {
          name: "$rows.name",
          weight: "$rows.weight",
          count: "$rows.count",
          Average: 1
        }
      },
      { $sort: { weight: -1 } }
    ]);

    res.json(results);

  } catch (err) {
    console.error("MongoDB Query Error:", err.message || err);
    res.status(500).json({ error: err.message || err });
  }
});

//from Genral economic data
app.get('/linechart', async (req, res) => {
  try {
    const { centres, genders, ages, question } = req.query;
    const questionField = question || "Q1_1";

    let centreList = centres ? centres.split(',').map(c => c.trim()) : [];
    let genderList = genders ? genders.split(',').map(g => g.trim()) : [];
    let ageList = ages ? ages.split(',').map(a => a.trim()) : [];

    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Dynamic match stage
    const matchStage = { [questionField]: { $ne: null } };
    if (centreList.length > 0) matchStage.FO = { $in: centreList };
    if (genderList.length > 0) matchStage.Gender = { $in: genderList };
    if (ageList.length > 0) matchStage.Age_Range = { $in: ageList };

    const pipeline = [
      { $match: matchStage },

      // Per-City group
      {
        $group: {
          _id: "$FO",
          total_responses: { $sum: 1 },
          current_improve_count: {
            $sum: {
              $cond: [
                {
                  $in: [
                    { $toLower: { $trim: { input: `$${questionField}` } } },
                    ["improved", "increased", "increase"]
                  ]
                },
                1,
                0
              ]
            }
          },
          current_same_count: {
            $sum: {
              $cond: [
                {
                  $in: [
                    { $toLower: { $trim: { input: `$${questionField}` } } },
                    ["remained the same", "remain the same"]
                  ]
                },
                1,
                0
              ]
            }
          },
          current_worsen_count: {
            $sum: {
              $cond: [
                {
                  $in: [
                    { $toLower: { $trim: { input: `$${questionField}` } } },
                    ["worsened", "decreased", "decrease"]
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },

      // Compute percentages for each city
      {
        $project: {
          city: "$_id",
          base: "$total_responses",
          current_improve_percentage: {
            $round: [
              {
                $cond: [
                  { $gt: ["$total_responses", 0] },
                  { $multiply: [{ $divide: ["$current_improve_count", "$total_responses"] }, 100] },
                  0
                ]
              },
              0
            ]
          },
          current_same_percentage: {
            $round: [
              {
                $cond: [
                  { $gt: ["$total_responses", 0] },
                  { $multiply: [{ $divide: ["$current_same_count", "$total_responses"] }, 100] },
                  0
                ]
              },
              0
            ]
          },
          current_worsen_percentage: {
            $round: [
              {
                $subtract: [
                  100,
                  {
                    $add: [
                      {
                        $round: [
                          {
                            $cond: [
                              { $gt: ["$total_responses", 0] },
                              { $multiply: [{ $divide: ["$current_improve_count", "$total_responses"] }, 100] },
                              0
                            ]
                          },
                          0
                        ]
                      },
                      {
                        $round: [
                          {
                            $cond: [
                              { $gt: ["$total_responses", 0] },
                              { $multiply: [{ $divide: ["$current_same_count", "$total_responses"] }, 100] },
                              0
                            ]
                          },
                          0
                        ]
                      }
                    ]
                  }
                ]
              },
              0
            ]
          },
          current_net_responses: {
            $subtract: [
              {
                $round: [
                  {
                    $cond: [
                      { $gt: ["$total_responses", 0] },
                      { $multiply: [{ $divide: ["$current_improve_count", "$total_responses"] }, 100] },
                      0
                    ]
                  },
                  0
                ]
              },
              {
                $round: [
                  {
                    $cond: [
                      { $gt: ["$total_responses", 0] },
                      { $multiply: [{ $divide: ["$current_worsen_count", "$total_responses"] }, 100] },
                      0
                    ]
                  },
                  0
                ]
              }
            ]
          },
          sort_order: { $literal: 1 }
        }
      },

      // Union with "All Centres"
      {
        $unionWith: {
          coll: "rccs10",
          pipeline: [
            { $match: matchStage },
            {
              $group: {
                _id: null,
                total_responses: { $sum: 1 },
                current_improve_count: {
                  $sum: {
                    $cond: [
                      {
                        $in: [
                          { $toLower: { $trim: { input: `$${questionField}` } } },
                          ["improved", "increased", "increase"]
                        ]
                      },
                      1,
                      0
                    ]
                  }
                },
                current_same_count: {
                  $sum: {
                    $cond: [
                      {
                        $in: [
                          { $toLower: { $trim: { input: `$${questionField}` } } },
                          ["remained the same", "remain the same"]
                        ]
                      },
                      1,
                      0
                    ]
                  }
                },
                current_worsen_count: {
                  $sum: {
                    $cond: [
                      {
                        $in: [
                          { $toLower: { $trim: { input: `$${questionField}` } } },
                          ["worsened", "decreased", "decrease"]
                        ]
                      },
                      1,
                      0
                    ]
                  }
                }
              }
            },
            {
              $project: {
                city: { $literal: "All Centres" },
                base: "$total_responses",
                current_improve_percentage: {
                  $round: [
                    {
                      $cond: [
                        { $gt: ["$total_responses", 0] },
                        { $multiply: [{ $divide: ["$current_improve_count", "$total_responses"] }, 100] },
                        0
                      ]
                    },
                    0
                  ]
                },
                current_same_percentage: {
                  $round: [
                    {
                      $cond: [
                        { $gt: ["$total_responses", 0] },
                        { $multiply: [{ $divide: ["$current_same_count", "$total_responses"] }, 100] },
                        0
                      ]
                    },
                    0
                  ]
                },
                current_worsen_percentage: {
                  $round: [
                    {
                      $subtract: [
                        100,
                        {
                          $add: [
                            {
                              $round: [
                                {
                                  $cond: [
                                    { $gt: ["$total_responses", 0] },
                                    { $multiply: [{ $divide: ["$current_improve_count", "$total_responses"] }, 100] },
                                    0
                                  ]
                                },
                                0
                              ]
                            },
                            {
                              $round: [
                                {
                                  $cond: [
                                    { $gt: ["$total_responses", 0] },
                                    { $multiply: [{ $divide: ["$current_same_count", "$total_responses"] }, 100] },
                                    0
                                  ]
                                },
                                0
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    0
                  ]
                },
                current_net_responses: {
                  $subtract: [
                    {
                      $round: [
                        {
                          $cond: [
                            { $gt: ["$total_responses", 0] },
                            { $multiply: [{ $divide: ["$current_improve_count", "$total_responses"] }, 100] },
                            0
                          ]
                        },
                        0
                      ]
                    },
                    {
                      $round: [
                        {
                          $cond: [
                            { $gt: ["$total_responses", 0] },
                            { $multiply: [{ $divide: ["$current_worsen_count", "$total_responses"] }, 100] },
                            0
                          ]
                        },
                        0
                      ]
                    }
                  ]
                },
                sort_order: { $literal: 0 }
              }
            }
          ]
        }
      },

      // Sort order like SQL
      { $sort: { sort_order: 1, city: 1 } }
    ];

    const results = await Achieved.aggregate(pipeline);
    res.json(results);

  } catch (err) {
    console.error("Aggregation Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/linechart2', async (req, res) => {
  const { centres, genders, ages, question } = req.query;

  const q = question || "Q1_2";

  let centreList = centres ? centres.split(',').map(c => c.trim()) : [];
  let genderList = genders ? genders.split(',').map(g => g.trim()) : [];
  let ageList = ages ? ages.split(',').map(a => a.trim()) : [];

  if (centreList.includes("All")) centreList = [];
  if (genderList.includes("All")) genderList = [];
  if (ageList.includes("All")) ageList = [];

  // ---------- FILTER STAGE ----------
  const matchStage = {
    [q]: { $ne: null } // field must not be null
  };

  if (centreList.length > 0) {
    matchStage.fo = { $in: centreList };
  }
  if (genderList.length > 0) {
    matchStage.Gender = { $in: genderList };
  }
  if (ageList.length > 0) {
    matchStage.Age_Range = { $in: ageList };
  }

  try {
    const pipeline = [
      { $match: matchStage },

      // ---------- CITY GROUP ----------
      {
        $group: {
          _id: "$FO",
          total_responses: { $sum: 1 },
          future_improve_count: {
            $sum: {
              $cond: [
                { $in: [{ $toLower: { $trim: { input: `$${q}` } } }, ["improve", "increase"]] },
                1,
                0
              ]
            }
          },
          future_same_count: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: { $trim: { input: `$${q}` } } }, "remain the same"] },
                1,
                0
              ]
            }
          },
          future_worsen_count: {
            $sum: {
              $cond: [
                { $in: [{ $toLower: { $trim: { input: `$${q}` } } }, ["worsen", "decrease"]] },
                1,
                0
              ]
            }
          }
        }
      },

      // ---------- CALCULATE PERCENTAGES ----------
      {
        $project: {
          city: "$_id",
          base: "$total_responses",
          future_improve_percentage: {
            $round: [
              { $multiply: [{ $divide: ["$future_improve_count", "$total_responses"] }, 100] },
              0
            ]
          },
          future_same_percentage: {
            $round: [
              { $multiply: [{ $divide: ["$future_same_count", "$total_responses"] }, 100] },
              0
            ]
          },
          future_worsen_percentage: {
            $subtract: [
              100,
              {
                $add: [
                  { $round: [{ $multiply: [{ $divide: ["$future_improve_count", "$total_responses"] }, 100] }, 0] },
                  { $round: [{ $multiply: [{ $divide: ["$future_same_count", "$total_responses"] }, 100] }, 0] }
                ]
              }
            ]
          },
          future_net_responses: {
            $subtract: [
              { $round: [{ $multiply: [{ $divide: ["$future_improve_count", "$total_responses"] }, 100] }, 0] },
              { $round: [{ $multiply: [{ $divide: ["$future_worsen_count", "$total_responses"] }, 100] }, 0] }
            ]
          },
          sort_order: { $literal: 1 }
        }
      },

      // ---------- UNION "ALL CENTRES" ----------
      {
        $facet: {
          cities: [{ $sort: { city: 1 } }],
          totals: [
            {
              $group: {
                _id: null,
                total_responses: { $sum: "$base" },
                future_improve_count: { $sum: "$future_improve_percentage" }, // careful: this is already %
                future_same_count: { $sum: "$future_same_percentage" },
                future_worsen_count: { $sum: "$future_worsen_percentage" }
              }
            },
            {
              $project: {
                city: "All Centres",
                base: "$total_responses",
                future_improve_percentage: "$future_improve_count",
                future_same_percentage: "$future_same_count",
                future_worsen_percentage: "$future_worsen_count",
                future_net_responses: { $subtract: ["$future_improve_count", "$future_worsen_count"] },
                sort_order: { $literal: 0 }
              }
            }
          ]
        }
      },

      // ---------- MERGE RESULTS ----------
      {
        $project: {
          combined: { $concatArrays: ["$totals", "$cities"] }
        }
      },
      { $unwind: "$combined" },
      { $replaceRoot: { newRoot: "$combined" } },
      { $sort: { sort_order: 1, city: 1 } }
    ];

    const results = await Achieved.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/ieschart", async (req, res) => {
  try {
    const { centres, genders, ages, question } = req.query;
    const q = question || "Q1_2"; // default question

    // Clean filters
    let centreList = centres ? centres.split(",").map(c => c.trim()) : [];
    let genderList = genders ? genders.split(",").map(g => g.trim()) : [];
    let ageList = ages ? ages.split(",").map(a => a.trim()) : [];

    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Build filters
    const match = {};
    match[q] = { $ne: null }; // only non-null answers
    if (centreList.length) match.FO = { $in: centreList };
    if (genderList.length) match.Gender = { $in: genderList };
    if (ageList.length) match.Age_Range = { $in: ageList };

    // Fixed categories
    const categories = [
      "<1%", "1-<1.99%", "2-<2.99%", "3-<3.99%", "4-<4.99%",
      "5-<5.99%", "6-<6.99%", "7-<7.99%", "8-<8.99%", "9-<9.99%",
      "10-<10.99%", "11-<11.99%", "12-<12.99%", "13-<13.99%",
      "14-<14.99%", "15-<15.99%", ">=16%", "No idea"
    ];

    // Build pipeline
    const pipeline = [
      { $match: match },
      {
        $facet: {
          total: [{ $count: "totalCount" }],
          grouped: [{ $group: { _id: `$${q}`, count: { $sum: 1 } } }]
        }
      },
      {
        $project: {
          totalCount: { $ifNull: [{ $arrayElemAt: ["$total.totalCount", 0] }, 0] },
          grouped: 1
        }
      },
      {
        $project: {
          results: {
            $map: {
              input: categories,
              as: "cat",
              in: {
                brackets: "$$cat",
                count: {
                  $ifNull: [
                    {
                      $let: {
                        vars: {
                          match: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$grouped",
                                  as: "g",
                                  cond: { $eq: ["$$g._id", "$$cat"] }
                                }
                              },
                              0
                            ]
                          }
                        },
                        in: "$$match.count"
                      }
                    },
                    0
                  ]
                },
                current_percentage: {
                  $cond: [
                    { $gt: ["$totalCount", 0] },
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $ifNull: [
                                    {
                                      $let: {
                                        vars: {
                                          match: {
                                            $arrayElemAt: [
                                              {
                                                $filter: {
                                                  input: "$grouped",
                                                  as: "g",
                                                  cond: { $eq: ["$$g._id", "$$cat"] }
                                                }
                                              },
                                              0
                                            ]
                                          }
                                        },
                                        in: "$$match.count"
                                      }
                                    },
                                    0
                                  ]
                                },
                                "$totalCount"
                              ]
                            },
                            100
                          ]
                        },
                        0
                      ]
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      { $unwind: "$results" },
      { $replaceRoot: { newRoot: "$results" } }
    ];

    const results = await Achieved.aggregate(pipeline);

    res.json(results);
  } catch (err) {
    console.error("MongoDB Aggregate Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/ieschart2", async (req, res) => {
  try {
    const { centres, genders, ages, question } = req.query;
    const q = question || "Q1_2"; // default column if no question given

    // Clean filters
    let centreList = centres ? centres.split(",").map(c => c.trim()) : [];
    let genderList = genders ? genders.split(",").map(g => g.trim()) : [];
    let ageList = ages ? ages.split(",").map(a => a.trim()) : [];

    if (centreList.includes("All")) centreList = [];
    if (genderList.includes("All")) genderList = [];
    if (ageList.includes("All")) ageList = [];

    // Build filters
    const match = {};
    match[q] = { $ne: null };
    if (centreList.length) match.FO = { $in: centreList };
    if (genderList.length) match.Gender = { $in: genderList };
    if (ageList.length) match.Age_Range = { $in: ageList };

    // Fixed categories for ordering
    const categories = [
      "<1%", "1-<1.99%", "2-<2.99%", "3-<3.99%", "4-<4.99%",
      "5-<5.99%", "6-<6.99%", "7-<7.99%", "8-<8.99%", "9-<9.99%",
      "10-<10.99%", "11-<11.99%", "12-<12.99%", "13-<13.99%",
      "14-<14.99%", "15-<15.99%", ">=16%", "No idea"
    ];

    // Build pipeline
    const pipeline = [
      { $match: match },
      {
        $facet: {
          total: [{ $count: "totalCount" }],
          grouped: [{ $group: { _id: `$${q}`, count: { $sum: 1 } } }]
        }
      },
      {
        $project: {
          totalCount: { $ifNull: [{ $arrayElemAt: ["$total.totalCount", 0] }, 0] },
          grouped: 1
        }
      },
      {
        $project: {
          results: {
            $map: {
              input: categories,
              as: "cat",
              in: {
                brackets: "$$cat",
                count: {
                  $ifNull: [
                    {
                      $let: {
                        vars: {
                          match: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$grouped",
                                  as: "g",
                                  cond: { $eq: ["$$g._id", "$$cat"] }
                                }
                              },
                              0
                            ]
                          }
                        },
                        in: "$$match.count"
                      }
                    },
                    0
                  ]
                },
                expected_percentage: {
                  $cond: [
                    { $gt: ["$totalCount", 0] },
                    {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $ifNull: [
                                    {
                                      $let: {
                                        vars: {
                                          match: {
                                            $arrayElemAt: [
                                              {
                                                $filter: {
                                                  input: "$grouped",
                                                  as: "g",
                                                  cond: { $eq: ["$$g._id", "$$cat"] }
                                                }
                                              },
                                              0
                                            ]
                                          }
                                        },
                                        in: "$$match.count"
                                      }
                                    },
                                    0
                                  ]
                                },
                                "$totalCount"
                              ]
                            },
                            100
                          ]
                        },
                        0
                      ]
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      { $unwind: "$results" },
      { $replaceRoot: { newRoot: "$results" } }
    ];

    const results = await Achieved.aggregate(pipeline);

    res.json(results);
  } catch (err) {
    console.error("MongoDB Aggregate Error:", err);
    res.status(500).json({ error: err.message });
  }
});

//login
// ✅ MongoDB based login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // 🔍 find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 🔑 check password (plain-text comparison)
    if (password === user.password) {
      return res.json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          email: user.email,
        },
      });
    } else {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// upload
const RCCS = mongoose.connection.collection("rccs10");

app.post("/upload-data", upload.single("file"), (req, res) => {
  const fileRows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => {
      console.error("CSV Parse Error:", error);
      return res.status(500).json({ message: error.message });
    })
    .on("data", (row) => fileRows.push(row))
    .on("end", async () => {
      if (fileRows.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "CSV file is empty." });
      }

      try {
        // ✅ Normalize keys
        const cleanedRows = fileRows.map((row) => {
          const cleaned = {};
          for (const key in row) {
            const newKey = key.trim().toLowerCase();
            cleaned[newKey] = row[key]?.trim();
          }
          return cleaned;
        });

        // ✅ Drop old collection if exists
        const collections = await mongoose.connection.db.listCollections({ name: "rccs10" }).toArray();
        if (collections.length > 0) {
          await mongoose.connection.db.dropCollection("rccs10");
          console.log("Old rccs10 collection dropped");
        }

        // ✅ Insert new data
        await RCCS.insertMany(cleanedRows);

        fs.unlinkSync(req.file.path); // cleanup
        res.json({ message: "File uploaded & data inserted successfully!" });
      } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ message: err.message });
      }
    });
});


// Works in Express v5+
// app.use((req, res) => {
//   console.log(__dirname);
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });
 


// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Catch-all: send index.html for any other GET request (for SPA routing)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });



// Start server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

