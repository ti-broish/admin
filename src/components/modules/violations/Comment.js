import React from 'react';

import styled from 'styled-components';

import { formatTime, formatDateShort } from '../../utils/Util';

export const CommentStyle = styled.div`
  width: 100%;

  h1 {
    font-weight: normal;
    font-size: 22px;
    margin: 5px 0;
    color: #555;
  }

  h2 {
    font-weight: normal;
    font-size: 16px;
    margin: 5px 0;
    color: #bbb;
  }

  p {
    color: #333;
  }

  .comment-type {
    color: #888;
    border: 3px solid #888;
    border-radius: 10px;
    font-size: 12px;
    padding: 5px;
    font-weight: bold;
    vertical-align: top;
    display: inline-block;
    margin-left: 10px;
    margin-top: -2px;
  }
`;

export default (props) => {
  const formatCommentType = (commentType) => {
    switch (commentType) {
      case 'internal':
        return 'Вътрешен';
      default:
        return 'Вътрешен';
    }
  };

  return (
    <CommentStyle>
      <h1>
        {props.comment.author.firstName} {props.comment.author.lastName}
        <span className="comment-type">
          {formatCommentType(props.comment.type)}
        </span>
      </h1>
      <h2>
        {formatTime(props.comment.createdAt)} –{' '}
        {formatDateShort(props.comment.createdAt)}
      </h2>
      <p>{props.comment.text}</p>
    </CommentStyle>
  );
};
