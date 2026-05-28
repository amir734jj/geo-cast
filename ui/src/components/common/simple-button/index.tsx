import classNames from 'classnames';
import {Spinner} from 'react-bootstrap';
import {type ButtonHTMLAttributes, type CSSProperties, type ReactNode} from 'react';

type SimpleButtonProps = {
  loading?: boolean;
  wide?: boolean;
  tooltip?: string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: string;
};

const SimpleButton = ({loading = false, wide = false, tooltip = '', disabled = false, type = 'button', onClick, children, className, style = {}, variant = 'primary', ...props}: SimpleButtonProps) => {
  const spanProps: Record<string, string> = {};
  if (tooltip) {
    spanProps['data-bs-toggle'] = 'tooltip';
    spanProps['data-bs-placement'] = 'bottom';
    spanProps['title'] = tooltip;
  }

  return (
    <span className={classNames('d-inline-block', {'w-100': wide})} tabIndex={0} {...spanProps}>
      <button
        {...props}
        type={type}
        onClick={onClick}
        className={classNames('btn', `btn-${variant}`, {'w-100': wide}, className)}
        style={{...style, borderColor: 'transparent'}}
        disabled={disabled || loading}>
        {loading ? <Spinner as="span" animation="border" size="sm" role="status" className="me-1" /> : null}
        {children}
      </button>
    </span>
  );
};

export default SimpleButton;
