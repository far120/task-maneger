import "./confirm.css"
export default function ConfirmDeleteModal({ id, onConfirm, onCancel , name }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete <span className="span">{name}</span>?</p>
                <button className="btn confirm-btn" onClick={() => onConfirm(id)}>Yes</button>
                <button className="btn cancel-btn" onClick={onCancel}>No</button>
            </div>
        </div>
    );
}

