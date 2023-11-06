import { useEffect, useState } from 'react';
import RecipientAvatar from './RecipientAvatar';
import { styled } from '@mui/material';
import { useRouter } from 'next/router';
import db from '@/firebase'; // Adjust the path to your firebase configuration
import { collection, doc, getDoc, DocumentData } from 'firebase/firestore';
import { Conversation } from '@/app/models/Chats';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const StyledContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '15px',
  wordBreak: 'break-all',

  '&:hover': {
    backgroundColor: '#e9eaeb',
  },
}));

const ConversationSelect = ({ id }: { id: string; conversationUsers: Conversation['users'] }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const onSelectConversation = () => {
    router.push(`/conversations/${id}`);
  };

  return (
    <StyledContainer onClick={onSelectConversation}>
      <RecipientAvatar recipient={user} recipientEmail={user.email} />
      <span>{user.email}</span>
    </StyledContainer>
  );
};

export default ConversationSelect;
