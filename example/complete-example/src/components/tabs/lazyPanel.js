import React from 'react';
export default function LazyPanel(props) {
  return <p>tab content {props.id} is loaded lazily.</p>;
}
