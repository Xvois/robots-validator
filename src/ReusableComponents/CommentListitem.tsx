import React from "react";

interface CommentListItemProps {
    comment: {
        index: number,
        messageElement: React.ReactNode
    },
    robotsArray: string[]
}

const CommentListItem: React.FC<CommentListItemProps> = ({comment, robotsArray}) => {
    return (
        <li className="summary-li-instance">
            {comment.index > -1 && (
                <a style={{color: 'var(--primary-colour)', marginRight: '5px'}} href={`#${comment.index}`}>
                    Line {comment.index + 1}
                </a>
            )}
            {comment.index > -1 && (
                <code style={{fontWeight: 'bold'}}>
                    {robotsArray[comment.index]}
                </code>
            )}
            {comment.messageElement}
        </li>
    );
};

export default CommentListItem;
