import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { BootstrapVariantType } from "../../../types";

export type AlertDismissiblePropType = {
  message: string;
  header: string;
  variant: BootstrapVariantType;
  dismissible?: boolean;
};

const AlertDismissible = ({ message, header, variant, dismissible = false }: AlertDismissiblePropType) => {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant={variant} onClose={() => setShow(false)} dismissible={dismissible}>
        <Alert.Heading> {header}</Alert.Heading>
        <p> {message} </p>
      </Alert>
    );
  }
  return null;
};

export default AlertDismissible;
