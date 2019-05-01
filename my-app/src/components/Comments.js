import React from 'react'

//Depending if the user is logged in or not, display the delete button in each comment
const Comments = ({data, productid, deleteComment, loggedUser}) => {
    const alldata = data.comment.length ? (
        data.comment.map(comment => {
            if (comment.productid === productid) {
                if (comment.author === loggedUser) {
                    return (
                        <li className="comment-li" key={Math.random()}><strong>{comment.author}:</strong> {comment.text}
                            <span onClick={() => {
                                deleteComment(comment._id)
                            }} className="delete-comment btn btn-danger">Delete</span></li>
                    )
                } else {
                    return (
                        <li className="comment-li" key={Math.random()}><strong>{comment.author}:</strong> {comment.text}
                            <span onClick={() => {
                                deleteComment(comment._id)
                            }} className="delete-comment hidden btn btn-danger">Delete</span></li>
                    )
                }
            }
            return null;
        })
    ) : (
        <li>This item has no comments</li>
    );

    //Returns the variable declared above
    return (
        <div className="collection">
            {alldata}
        </div>
    )
};

export default Comments;