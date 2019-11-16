import React from 'react'
import './Slider.css'
import { Range, getTrackBackground } from 'react-range'

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  marks?: React.ReactNode
  onChange: (value: number) => void
}

const Slider: React.FC<SliderProps> = ({ value, onChange, step, min, max, marks }) => {
  return (
    <div className="slider">
      <Range
        values={[value]}
        onChange={values => onChange(values[0])}
        step={step}
        min={min}
        max={max}
        renderTrack={({ props, children }) => (
          <div onMouseDown={props.onMouseDown} onTouchStart={props.onTouchStart} className="slider-track">
            <div
              ref={props.ref}
              style={{
                background: getTrackBackground({
                  values: [value],
                  colors: ['#138D75', '#dddddd'],
                  min,
                  max,
                }),
              }}
              className="slider-track-inner"
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} style={{ ...props.style }} className="slider-thumb">
            {/* <span className="slider-thumb-label">{value}</span> */}
          </div>
        )}
      />
      <div className="slider-marks">{marks}</div>
    </div>
  )
}

export default Slider
