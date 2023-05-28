import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import {BootstrapVariantType} from "../../types/bootstrap.variant";

export type AlertDismissiblePropType = {
  message: string;
  header: string;
  variant: BootstrapVariantType;
};

const AlertDismissible = ({ message, header, variant }: AlertDismissiblePropType) => {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading> {header}</Alert.Heading>
        <p> {message} </p>
      </Alert>
    );
  }
  return null;
};

export default AlertDismissible;
