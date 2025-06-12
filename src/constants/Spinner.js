// @flow
import React from 'react';
import classNames from 'classnames';

type SpinnerProps = {
    tag?: string,
    className?: string,
    size?: 'lg' | 'md' | 'sm',
    type?: 'bordered' | 'grow',
    color?: string,
    children?: any,
};

/**
 * Spinner
 */
const Spinner = ({
    tag: Tag = 'div',
    className,
    size = '',
    type = 'bordered',
    color = 'secondary',
    children = null,
}: SpinnerProps): React$Element<any> => {
    return (
        <Tag
            role="status"
            className={classNames(
                {
                    'spinner-border': type === 'bordered',
                    'spinner-grow': type === 'grow',
                },
                [`text-${color}`],
                { [`avatar-${size}`]: size },
                className
            )}>
            {children}
        </Tag>
    );
};

export default Spinner;
