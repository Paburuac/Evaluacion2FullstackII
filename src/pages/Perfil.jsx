import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function BasicExample() {
  return (
    <ButtonGroup aria-label="Basic example">
      <Button variant="secondary">1</Button>
      <Button variant="secondary">2</Button>
      <Button variant="secondary">3</Button>
      <Button variant="secondary">4</Button>
      <Button variant="secondary">5</Button>
      <Button variant="secondary">6</Button>
    </ButtonGroup>
  );
}

export default BasicExample;