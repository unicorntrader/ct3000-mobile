import React from 'react';
import { Edit3, Save, BookOpen } from 'lucide-react';
import { getCurrentDate } from '../../utils/calculations';

export const Notes = (props) => {
  const { notes, setNotes, isMobile } = props;
  const today = getCurrentDate();
  const [currentNote, setCurrentNote] = React.useState(notes[today] || '');
  const [editingNote, setEditingNote] = React.useState(null);

  const saveNote = () => {
    setNotes({...notes, [today]: currentNote});
  };

  const editNote = (date, note) => {
    setEditingNote(date);
    setCurrentNote(note);
  };

  const saveEditedNote = () => {
    if (editingNote) {
      setNotes({...notes, [editingNote]: currentNote});
      setEditingNote(null);
      setCurrentNote(notes[today] || '');
    }
  };

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Notes</h2>
        
        {/* Today's Note */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Edit3 className="h-4 w-4 mr-2" />
            {editingNote ? `Edit Note - ${editingNote}` : `Today's Note - ${today}`}
          </h3>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Record your thoughts, market observations, lessons learned..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">{currentNote.length} characters</span>
            <div className="flex space-x-2">
              {editingNote && (
                <button
                  onClick={() => {
                    setEditingNote(null);
                    setCurrentNote(notes[today] || '');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={editingNote ? saveEditedNote : saveNote}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Previous Notes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Previous Notes</h3>
          {Object.entries(notes)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, note]) => (
              <div key={date} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{date}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{note.length} chars</span>
                    <button
                      onClick={() => editNote(date, note)}
                      className="text-blue-600 p-1"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  {note.length > 100 ? `${note.substring(0, 100)}...` : note}
                </p>
              </div>
            ))}
          
          {Object.keys(notes).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notes yet</p>
              <p className="text-sm">Start writing your first note above!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="space-y-6">
      {/* Today's Note Editor */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Edit3 className="h-5 w-5 mr-2" />
          {editingNote ? `Edit Note - ${editingNote}` : `Daily Trading Notes - ${today}`}
        </h3>
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Record your thoughts, market observations, trade analysis, lessons learned, etc."
        />
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {currentNote.length} characters
          </div>
          <div className="flex space-x-3">
            {editingNote && (
              <button
                onClick={() => {
                  setEditingNote(null);
                  setCurrentNote(notes[today] || '');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={editingNote ? saveEditedNote : saveNote}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </button>
          </div>
        </div>
      </div>
      
      {/* Previous Notes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Previous Notes</h3>
        <div className="space-y-3">
          {Object.entries(notes)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .slice(0, 10)
            .map(([date, note]) => (
              <div key={date} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{date}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{note.length} chars</span>
                    <button
                      onClick={() => editNote(date, note)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{note.substring(0, 200)}{note.length > 200 && '...'}</p>
              </div>
            ))}
          
          {Object.keys(notes).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No notes yet</p>
              <p className="text-sm">Start writing your first note above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
