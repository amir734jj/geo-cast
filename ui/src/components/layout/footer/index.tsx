const Footer = () => {
  return <div style={{
    width: '100%',
    textAlign: 'center',
    background: "#F8F9FA",
    padding: '0.5rem 0',
    marginTop: 'auto'
  }}>
    <p style={{margin: '0.5rem', fontSize: '75%'}}>All rights reserved &copy; {new Date().getFullYear()} - no BS, open-source, no selling of personal data</p>
  </div>
};

export default Footer;
