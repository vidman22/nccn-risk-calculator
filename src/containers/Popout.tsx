import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface Props {
    title: string;
    url: string; // The title of the popout window
    visible: boolean;
    onClose: () => void;
}

const OAuthPopout: React.FC<Props> = ({ title, url, visible, onClose, children }) => {
    const externalWindow = useRef<Window | null>();
    const [ containerElement, setContainerElement ] = useState<HTMLElement | null>();

    // When we create this component, open a new window
    useEffect(() => {
        setInterval(() => {
            if (externalWindow.current?.closed) {
                onClose();
            }
        }, 500);

        if (!visible) {
            localStorage.removeItem('popout');
            return;
        }
        const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
        externalWindow.current = window.open(url, 'NCCN Risk Nomogram Instructions', strWindowFeatures);
        const newContainerElement = externalWindow && externalWindow.current?.document.createElement('div');

        if (externalWindow.current) {
            newContainerElement && externalWindow.current?.document.body.appendChild(newContainerElement);
            externalWindow.current.document.title = title;

            window.addEventListener('beforeunload', () => {
                localStorage.setItem('popout', 'true');
            });
            externalWindow.current.addEventListener('beforeunload', () => {
                localStorage.setItem('popout', 'true');
            });

        }

        setContainerElement(newContainerElement);
        return () => {
            if (externalWindow.current) {
                localStorage.removeItem('code');
                localStorage.removeItem('popout');
                externalWindow.current.close();
            }
        };
    }, [ visible ]);

    if (!containerElement) {
        return null;
    }
    return (
        // Render this component's children into the root element of the popout window
        ReactDOM.createPortal(children, containerElement)
    );
};

export default OAuthPopout;