import React, { useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import { ChannelInfo } from '../assets';

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();
  
  const overrideSubmitHandler = (message) => {
    let updatedMessage = { ...message };
    if (giphyState) updatedMessage.text = `/giphy ${message.text}`;
    sendMessage(updatedMessage);
    setGiphyState(false);
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

const TeamChannelHeader = ({ setIsEditing }) => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();

  const MessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
    const additionalMembers = members.length - 3;

    return (
      <div className='team-channel-header__name-wrapper'>
        {members.slice(0, 3).map(({ user }, i) => (
          <div key={i} className='team-channel-header__name-multi'>
            <Avatar image={user.image} name={user.fullName || user.id} size={32} />
            <p className='team-channel-header__name user'>{user.fullName || user.id}</p>
          </div>
        ))}
        {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
      </div>
    );
  };

  const getWatcherText = (watchers) => (watchers === 1 ? '1 user online' : `${watchers || 0} users online`);

  return (
    <div className='team-channel-header__container'>
      <MessagingHeader />
      <div className='team-channel-header__right'>
        <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
        <span onClick={() => setIsEditing(true)}>
          <ChannelInfo />
        </span>
      </div>
    </div>
  );
};

const ExtendedComponent = () => {
  const { channel } = useChannelStateContext();

  return (
    <div>
      <h1>Channel Information</h1>
      <p>Channel ID: {channel.id}</p>
      <p>Channel Name: {channel.data.name}</p>
      <p>Channel Type: {channel.type}</p>
    </div>
  );
};

const ExtraFunctionality = () => {
  const [isExtended, setIsExtended] = useState(false);

  const toggleExtension = () => {
    setIsExtended((prevState) => !prevState);
  };

  return (
    <div>
      <button onClick={toggleExtension}>
        {isExtended ? 'Show Less' : 'Show More'}
      </button>
      {isExtended && <ExtendedComponent />}
    </div>
  );
};

const UserInfo = ({ user }) => (
  <div className='user-info'>
    <Avatar image={user.image} name={user.fullName || user.id} size={32} />
    <p className='user-info__name'>{user.fullName || user.id}</p>
  </div>
);

const MessagingHeaderExtended = ({ members }) => (
  <div className='messaging-header-extended'>
    {members.map(({ user }, i) => (
      <UserInfo key={i} user={user} />
    ))}
  </div>
);

const TeamChannelHeaderExtended = ({ setIsEditing }) => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();

  const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
  const additionalMembers = members.length - 3;

  return (
    <div className='team-channel-header__container'>
      <div className='team-channel-header__name-wrapper'>
        {members.slice(0, 3).map(({ user }, i) => (
          <UserInfo key={i} user={user} />
        ))}
        {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
      </div>
      <MessagingHeaderExtended members={members.slice(3)} />
      <div className='team-channel-header__right'>
        <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
        <span onClick={() => setIsEditing(true)}>
          <ChannelInfo />
        </span>
      </div>
    </div>
  );
};

const ChannelInnerExtended = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message) => {
    let updatedMessage = { ...message };
    if (giphyState) updatedMessage.text = `/giphy ${message.text}`;
    sendMessage(updatedMessage);
    setGiphyState(false);
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeaderExtended setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
          <ExtraFunctionality />
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

export default ChannelInnerExtended;
