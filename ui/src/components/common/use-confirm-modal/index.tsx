import {useState, useCallback, useRef} from 'react';
import {Modal, Button} from 'react-bootstrap';

export const useConfirmModal = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirmAction = useCallback((msg: string): Promise<boolean> => {
    setMessage(msg);
    setShow(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setShow(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const ConfirmModal = useCallback(() => (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  ), [show, message, handleCancel, handleConfirm]);

  return {confirmAction, ConfirmModal};
};
