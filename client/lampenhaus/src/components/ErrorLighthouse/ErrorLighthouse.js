import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ErrorLighthouse.css';

function ErrorLighthouse(props) {
    return (
        <Link to="/search/" className="error-image-wrapper">
            <div className="error-image">
                <svg x="0px" y="0px" viewBox="0 0 100 90" fill={props.fillColor}>
                    <g>
                        <polygon points="58.2,66 40.9,73.4 41.7,64.7 57.7,57.9" />
                        <path
                            d="M57.7,41.3h-1v-6.8h1c0.7,0,1.1-0.7,0.7-1.3l-3.3-2.4l-2.8-4.1c-1-1.4-3.1-1.4-4.1,0l-2.9,
                            4.1L42,33.2   c-0.4,0.6,0,1.3,0.7,1.3h1v6.8h-1c-0.7,0-1.1,0.8-0.7,1.3l1.6,2.4l-1,
                            10.2l14.4-6.1L56.8,45l1.6-2.4C58.8,42,58.4,41.3,57.7,41.3z    M53.7,41.3h-7v-6.8h7V41.3z"
                        />
                    </g>
                    <path
                        className="ray ray-1"
                        d="M27.7,61.2c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,1,0,
                        1.4l-8.6,8.6  C28.2,61.1,28,61.2,27.7,61.2z"
                    />
                    <path
                        className="ray ray-2"
                        d="M25.4,48.4c-0.4,0-0.8-0.2-0.9-0.6c-0.2-0.5,0.1-1.1,0.6-1.3l6.5-2.5c0.5-0.2,1.1,0.1,1.3,
                        0.6s-0.1,1.1-0.6,1.3l-6.5,2.5  C25.7,48.4,25.6,48.4,25.4,48.4z"
                    />
                    <path
                        className="ray ray-3"
                        d="M31.4,38.9H19.3c-0.6,0-1-0.4-1-1s0.4-1,1-1h12.1c0.6,0,1,0.4,1,1S31.9,38.9,31.4,38.9z"
                    />
                    <path
                        className="ray ray-4"
                        d="M33,31.3c-0.1,0-0.3,0-0.4-0.1l-7.1-3.1c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,
                        1.3-0.5l7.1,3.1c0.5,0.2,0.7,0.8,0.5,1.3  C33.7,31.1,33.4,31.3,33,31.3z"
                    />
                    <path
                        className="ray ray-5"
                        d="M36.3,25.1c-0.3,0-0.5-0.1-0.7-0.3L27,16.3c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,
                          0l8.6,8.6c0.4,0.4,0.4,1,0,1.4  C36.8,25,36.5,25.1,36.3,25.1z"
                    />
                    <path
                        className="ray ray-6"
                        d="M43,20.7c-0.4,0-0.8-0.2-0.9-0.6l-2.5-6.5c-0.2-0.5,0.1-1.1,0.6-1.3c0.5-0.2,1.1,
                          0.1,1.3,0.6l2.5,6.5  c0.2,0.5-0.1,1.1-0.6,1.3C43.2,20.6,43.1,20.7,43,20.7z"
                    />
                    <path
                        className="ray ray-7"
                        d="M50.2,20c-0.6,0-1-0.4-1-1V6.9c0-0.6,0.4-1,1-1s1,0.4,1,
                          1V19C51.2,19.6,50.8,20,50.2,20z"
                    />
                    <path
                        className="ray ray-8"
                        d="M57.4,20.7c-0.1,0-0.2,0-0.4-0.1c-0.5-0.2-0.8-0.8-0.6-1.3l2.5-6.5c0.2-0.5,
                          0.8-0.8,1.3-0.6c0.5,0.2,0.8,0.8,0.6,1.3  L58.4,20C58.2,20.4,57.8,20.7,57.4,20.7z"
                    />
                    <path
                        className="ray ray-9"
                        d="M64.2,25.1c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l8.6-8.6c0.4-0.4,1-0.4,1.4,0s0.4,
                          1,0,1.4l-8.6,8.6  C64.7,25,64.5,25.1,64.2,25.1z"
                    />
                    <path
                        className="ray ray-10"
                        d="M68.6,31.9c-0.4,0-0.8-0.2-0.9-0.6c-0.2-0.5,0.1-1.1,0.6-1.3l6.4-2.5c0.5-0.2,1.1,0.1,1.3,
                          0.6s-0.1,1.1-0.6,1.3l-6.4,2.5  C68.8,31.9,68.7,31.9,68.6,31.9z"
                    />
                    <path
                        className="ray ray-11"
                        d="M81.2,38.9H69.1c-0.6,0-1-0.4-1-1s0.4-1,1-1h12.1c0.6,0,1,0.4,1,1S81.8,38.9,81.2,38.9z"
                    />
                    <path
                        className="ray ray-12"
                        d="M74.5,49.5c-0.1,0-0.3,0-0.4-0.1l-7-3.1c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l7,
                        3.1c0.5,0.2,0.7,0.8,0.5,1.3  C75.3,49.3,74.9,49.5,74.5,49.5z"
                    />
                    <path
                        className="ray ray-13"
                        d="M72.8,61.2c-0.3,0-0.5-0.1-0.7-0.3l-8.6-8.6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l8.6,8.6c0.4,
                        0.4,0.4,1,0,1.4  C73.3,61.1,73,61.2,72.8,61.2z"
                    />
                    <text x="47" y="40">404</text>
                </svg>
            </div>
        </Link>
    );
}

ErrorLighthouse.defaultProps = {
    fillColor: '#444448',
};

ErrorLighthouse.propTypes = {
    fillColor: PropTypes.string,
};

export default ErrorLighthouse;
