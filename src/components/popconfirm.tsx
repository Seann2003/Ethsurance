import React, { useState } from 'react';

interface PopconfirmProps {
  title: string;
  content: string;
  okText: string;
  cancelText: string;
  onOk: () => void;
  children: React.ReactNode;
}

const Popconfirm: React.FC<PopconfirmProps> = ({ title, content, okText, cancelText, onOk, children }) => {
  const [visible, setVisible] = useState(false);

  const handleOk = () => {
    onOk();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div onClick={() => setVisible(!visible)}>
        {children}
      </div>
      {visible && (
        <div className="absolute z-10 left-0 right-0 bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-2">
          <div className="mb-2 font-semibold">{title}</div>
          <div className="mb-4">{content}</div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {cancelText}
            </button>
            <button
              onClick={handleOk}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {okText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popconfirm;