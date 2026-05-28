import {isValidElement, useState, type ReactNode} from 'react';
import {Modal, Button, Row, Col} from 'react-bootstrap';
import classNames from 'classnames';

type ShowData = {
  message?: ReactNode | ReactNode[];
} | null;

export const useConfirmModal = () => {
  const [showData, setShowData] = useState<ShowData>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirmAction = (message?: ReactNode | ReactNode[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setShowData({message});
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolvePromise?.(true);
    setShowData(null);
  };

  const handleClose = () => {
    resolvePromise?.(false);
    setShowData(null);
  };

  const ConfirmModal = ({messageClassName}: {messageClassName?: string} = {}) => (
    <Modal show={!!showData} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-around align-items-center">
          <Col md={10}>
            <p>Are you sure you want to proceed?</p>
            {!showData?.message ? null : Array.isArray(showData.message) ?
              showData.message.filter(Boolean).map((item, index) => (
                <p key={index} className={classNames('mt-1', messageClassName)}>{item}</p>
              )) :
              isValidElement(showData.message) ?
                <div className={classNames('mt-1', messageClassName)}>{showData.message}</div> :
                <p className={classNames('mt-1', messageClassName)}>{showData.message}</p>}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleConfirm}>Yes</Button>
      </Modal.Footer>
    </Modal>
  );

  return {confirmAction, ConfirmModal};
};
