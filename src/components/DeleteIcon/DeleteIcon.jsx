import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DeleteIcon = styled(FontAwesomeIcon)`
    position: absolute;
    font-size: 20px;
    color: slategray;
    align-self: center;
    width: 24px;
    cursor: pointer;
    opacity: 100;
    transition: all 150ms linear;
    right: 110px;
    
    &:hover {
        color: #61dafb;
        transform: scale(1.25);
    }
    
    &.hidden {
        opacity: 0;
    }
`;

export default DeleteIcon;
