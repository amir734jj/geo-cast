import React, {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Badge, Container, Form,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type TagInputElementPropType = {
  onRemove: (index: number) => void,
  value: string;
  index: number;
};

const TagInputElement = ({ onRemove, value, index }: TagInputElementPropType) => (
  <Badge style={{ marginRight: '0.5rem', fontSize: '1rem' }}>{value} {' '}
    <FontAwesomeIcon icon={faTimes} onClick={() => onRemove(index)} />
  </Badge>
);

export type InputTagsPropType = {
  values: string[];
  handleChange: (values: string[]) => void;
}

const InputTags = ({ values, handleChange }: InputTagsPropType) => {
  const [terms, setTerms] = useState(values);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTerms(values);
  }, [values]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const currentValue = value.trim().replace(/,$/, '');
    if ((key === 'Enter' || key === ' ' || key === ',') && currentValue !== '') {
      event.preventDefault();

      const newTerms = [...terms, currentValue];
      handleChange(newTerms);
      setTerms(newTerms);
      setValue('');
    }
  };

  const handleRemove = (index: number) => {
    const newTerms = terms.filter((_, i) => i !== index);
    setTerms(newTerms);
    handleChange(newTerms);
  };

  return (
    <Form.Group controlId="formBasicEmail">
      <Form.Label>Categories</Form.Label>
      <Container fluid style={{ marginBottom: '1rem' }}>
        {terms.map((item, index) => (
          <TagInputElement
            key={`${item}${index}`}
            value={item}
            index={index}
            onRemove={handleRemove}
          />
        ))}
      </Container>
      <Form.Control
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        type="text"
        placeholder="Enter tags"
      />
      <Form.Text className="text-muted">
        Select categories of this project and press space or comma
      </Form.Text>
    </Form.Group>
  );
};


export default InputTags;
