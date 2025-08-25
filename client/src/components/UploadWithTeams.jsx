import React, { useState } from 'react';

const UploadWithTeams = () => {
  const [filesData, setFilesData] = useState([]);
  const [teamTabs, setTeamTabs] = useState({ A: [], B: [], C: [], D: [] });
  const [activeTab, setActiveTab] = useState('A');

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      id: Math.random(),
      file,
      team: 'A',
      rename: file.name,
      heading: '',
      subHeading: ''
    }));
    setFilesData(selected);
  };

  const handleInputChange = (id, field, value) => {
    setFilesData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = () => {
    const newTabs = { ...teamTabs };
    filesData.forEach((item) => {
      newTabs[item.team].push(item);
    });
    setTeamTabs(newTabs);
    setFilesData([]); // clear after submit
  };

  return (
    <div className="p-4 max-w-3xl mx-auto max-h-screen overflow-y-auto">
      {/* File Upload */}
      <input type="file" multiple onChange={handleFileChange} className="mb-4" />

      {/* Preview and Edit Section */}
      {filesData.length > 0 && (
        <>
          <h3 className="font-bold mb-2 max-h-screen overflow-y-auto p-4">Preview Files</h3>
          {filesData.map((item) => (
            <div key={item.id} className="border p-3 mb-3 rounded">
              <p><strong>Original:</strong> {item.file.name}</p>

              <label className="block mt-2">
                Team:
                <select
                  value={item.team}
                  onChange={(e) => handleInputChange(item.id, 'team', e.target.value)}
                  className="ml-2"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </label>

              <label className="block mt-2">
                Rename:
                <input
                  type="text"
                  value={item.rename}
                  onChange={(e) => handleInputChange(item.id, 'rename', e.target.value)}
                  className="ml-2 border rounded p-1"
                />
              </label>

              <label className="block mt-2">
                Heading:
                <input
                  type="text"
                  value={item.heading}
                  onChange={(e) => handleInputChange(item.id, 'heading', e.target.value)}
                  className="ml-2 border rounded p-1"
                />
              </label>

              <label className="block mt-2">
                Sub Heading:
                <input
                  type="text"
                  value={item.subHeading}
                  onChange={(e) => handleInputChange(item.id, 'subHeading', e.target.value)}
                  className="ml-2 border rounded p-1"
                />
              </label>
            </div>
          ))}
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </>
      )}

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex space-x-4 border-b">
          {['A', 'B', 'C', 'D'].map((team) => (
            <button
              key={team}
              onClick={() => setActiveTab(team)}
              className={`px-4 py-2 font-bold ${
                activeTab === team ? 'border-b-2 border-blue-500 text-blue-600' : ''
              }`}
            >
              Team {team}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {teamTabs[activeTab].length === 0 ? (
            <p>No files for Team {activeTab}</p>
          ) : (
            teamTabs[activeTab].map((fileData, idx) => (
              <div key={idx} className="border p-3 mb-2 rounded">
                <p><strong>Renamed:</strong> {fileData.rename}</p>
                <p><strong>Heading:</strong> {fileData.heading}</p>
                <p><strong>Sub Heading:</strong> {fileData.subHeading}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadWithTeams;
