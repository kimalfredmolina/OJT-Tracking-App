import React from 'react'
import '../index.css'

const AnimatedBorderlineCard = ({
    children,
    className = '',
    innerClassName = '',
    style = {},
}) => {
    return (
        <div
            className={`animated-border-card w-full max-w-sm mx-4 ${className}`}
            style={style}
        >
            <div className={`animated-border-card-inner ${innerClassName}`}>
                {children}
            </div>
        </div>
    )
}

export default AnimatedBorderlineCard