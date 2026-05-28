import {type ReactElement} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

type BsTooltipProps = {
  message: string;
  children: ReactElement;
  className?: string;
  style?: React.CSSProperties;
};

const BsTooltip = ({className = '', style = {}, message, children}: BsTooltipProps) => {
  return <div className={className} style={style}>
    <OverlayTrigger
      placement="auto-start"
      delay={{show: 250, hide: 400}}
      overlay={<Tooltip>{message}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  </div>;
};

export default BsTooltip;
