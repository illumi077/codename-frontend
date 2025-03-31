const ActionButtons = ({ onLeave }) => {
    return (
      <div className="action-buttons-container">
        <button className="retro-button" onClick={onLeave}>Leave Room</button>
      </div>
    );
  };
  
export default ActionButtons;
  