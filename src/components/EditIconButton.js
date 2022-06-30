import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ActionIconButton(props) {
    const action = props.action;
    const value = props.value;
    const handleClick = () => {
        props.onClick(value, action);
    }

    return (
        <IconButton>
            {(() => {
                if (action === 'edit') {
                    return (
                        <EditIcon onClick={handleClick} />
                    )
                } else if (action === 'delete') {
                    return (
                        <DeleteIcon onClick={handleClick} />
                    )
                }
            })()}
        </IconButton>
    );
}

export default ActionIconButton;