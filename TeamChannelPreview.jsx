import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type }) => {
  const { channel: activeChannel, client } = useChatContext();

  const ChannelPreview = () => (
    <p className="channel-preview__item">
      # {channel?.data?.name || channel?.data?.id}
    </p>
  );

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);

    return (
      <div className="channel-preview__item single">
        <Avatar
          image={members[0]?.user?.image}
          name={members[0]?.user?.fullName || members[0]?.user?.id}
          size={24}
        />
        <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
      </div>
    );
  };

  const handleClick = () => {
    setIsCreating(false);
    setIsEditing(false);
    setActiveChannel(channel);
    if (setToggleContainer) {
      setToggleContainer((prevState) => !prevState);
    }
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? 'channel-preview__wrapper__selected'
          : 'channel-preview__wrapper'
      }
      onClick={handleClick}
    >
      {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
    </div>
  );
};

const UserInfo = ({ user }) => (
  <div className="user-info">
    <Avatar image={user.image} name={user.fullName || user.id} size={32} />
    <p className="user-info__name">{user.fullName || user.id}</p>
  </div>
);

const MessagingHeaderExtended = ({ members }) => (
  <div className="messaging-header-extended">
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
    <div className="team-channel-header__container">
      <div className="team-channel-header__name-wrapper">
        {members.slice(0, 3).map(({ user }, i) => (
          <UserInfo key={i} user={user} />
        ))}
        {additionalMembers > 0 && <p className="team-channel-header__name user">and {additionalMembers} more</p>}
      </div>
      <MessagingHeaderExtended members={members.slice(3)} />
      <div className="team-channel-header__right">
        <p className="team-channel-header__right-text">{getWatcherText(watcher_count)}</p>
        <span onClick={() => setIsEditing(true)}>
          <ChannelInfo />
        </span>
      </div>
    </div>
  );
};

const getWatcherText = (watchers) => (watchers === 1 ? '1 user online' : `${watchers || 0} users online`);

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

const TeamChannelPreviewExtended = ({
  setActiveChannel,
  setIsCreating,
  setIsEditing,
  setToggleContainer,
  channel,
  type
}) => {
  const { channel: activeChannel, client } = useChatContext();

  const ChannelPreview = () => (
    <p className="channel-preview__item">
      # {channel?.data?.name || channel?.data?.id}
    </p>
  );

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);

    return (
      <div className="channel-preview__item single">
        <Avatar
          image={members[0]?.user?.image}
          name={members[0]?.user?.fullName || members[0]?.user?.id}
          size={24}
        />
        <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
      </div>
    );
  };

  const handleClick = () => {
    setIsCreating(false);
    setIsEditing(false);
    setActiveChannel(channel);
    if (setToggleContainer) {
      setToggleContainer((prevState) => !prevState);
    }
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? 'channel-preview__wrapper__selected'
          : 'channel-preview__wrapper'
      }
      onClick={handleClick}
    >
      {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
      <ExtraFunctionality />
    </div>
  );
};

export default TeamChannelPreviewExtended;
