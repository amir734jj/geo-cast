import {useEffect, useState} from "react";

const Footer = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setVisible(false);
    }, 1000 * 5);

    return () => {
      clearTimeout(id);
    }
  }, []);

  return <div style={{
    position: 'absolute',
    bottom: '0px',
    width: '100%',
    textAlign: 'center',
    background: "#F8F9FA",
    zIndex: -9999,
    display: visible ? "block" : "none"
  }}>
    <p style={{margin: '0.5rem', fontSize: '75%'}}>All rights reserved @ 2023 - no BS, open-source, no selling of personal data</p>
  </div>
};

export default Footer;
