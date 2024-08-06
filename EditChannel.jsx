import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();
        setChannelName(event.target.value);
    };

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    );
};

const ChannelTopicInput = ({ channelTopic = '', setChannelTopic }) => {
    const handleChange = (event) => {
        event.preventDefault();
        setChannelTopic(event.target.value);
    };

    return (
        <div className="channel-topic-input__wrapper">
            <p>Topic</p>
            <input value={channelTopic} onChange={handleChange} placeholder="channel-topic" />
        </div>
    );
};

const MemberList = ({ members, removeMember }) => {
    return (
        <div className="member-list__wrapper">
            {members.map((member, index) => (
                <div key={index} className="member-list__item">
                    <p>{member}</p>
                    <button onClick={() => removeMember(member)}>Remove</button>
                </div>
            ))}
        </div>
    );
};

const EditChannel = ({ setIsEditing }) => {
    const { channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [channelTopic, setChannelTopic] = useState(channel?.data?.topic || '');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentMembers, setCurrentMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const members = await channel.queryMembers({});
            setCurrentMembers(members.members.map((m) => m.user_id));
        };

        fetchMembers();
    }, [channel]);

    const updateChannel = async (event) => {
        event.preventDefault();

        const nameChanged = channelName !== (channel.data.name || channel.data.id);
        const topicChanged = channelTopic !== (channel.data.topic || '');

        if (nameChanged) {
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` });
        }

        if (topicChanged) {
            await channel.updatePartial({ set: { topic: channelTopic } }, { text: `Channel topic changed to ${channelTopic}` });
        }

        if (selectedUsers.length) {
            await channel.addMembers(selectedUsers);
        }

        setChannelName(null);
        setChannelTopic('');
        setIsEditing(false);
        setSelectedUsers([]);
    };

    const removeMember = async (userId) => {
        await channel.removeMembers([userId]);
        setCurrentMembers((prevMembers) => prevMembers.filter((member) => member !== userId));
    };

    return (
        <div className="edit-channel__container">
            <div className="edit-channel__header">
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>
            <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
            <ChannelTopicInput channelTopic={channelTopic} setChannelTopic={setChannelTopic} />
            <UserList setSelectedUsers={setSelectedUsers} />
            <MemberList members={currentMembers} removeMember={removeMember} />
            <div className="edit-channel__button-wrapper" onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
        </div>
    );
};

const ChannelDescriptionInput = ({ channelDescription = '', setChannelDescription }) => {
    const handleChange = (event) => {
        event.preventDefault();
        setChannelDescription(event.target.value);
    };

    return (
        <div className="channel-description-input__wrapper">
            <p>Description</p>
            <input value={channelDescription} onChange={handleChange} placeholder="channel-description" />
        </div>
    );
};

const AdditionalSettings = ({ settings, setSettings }) => {
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
    };

    return (
        <div className="additional-settings__wrapper">
            <p>Additional Settings</p>
            <input
                name="setting1"
                value={settings.setting1}
                onChange={handleChange}
                placeholder="Setting 1"
            />
            <input
                name="setting2"
                value={settings.setting2}
                onChange={handleChange}
                placeholder="Setting 2"
            />
        </div>
    );
};

const EditChannelExtended = ({ setIsEditing }) => {
    const { channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [channelTopic, setChannelTopic] = useState(channel?.data?.topic || '');
    const [channelDescription, setChannelDescription] = useState(channel?.data?.description || '');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [settings, setSettings] = useState({ setting1: '', setting2: '' });

    useEffect(() => {
        const fetchMembers = async () => {
            const members = await channel.queryMembers({});
            setCurrentMembers(members.members.map((m) => m.user_id));
        };

        fetchMembers();
    }, [channel]);

    const updateChannel = async (event) => {
        event.preventDefault();

        const nameChanged = channelName !== (channel.data.name || channel.data.id);
        const topicChanged = channelTopic !== (channel.data.topic || '');
        const descriptionChanged = channelDescription !== (channel.data.description || '');

        if (nameChanged) {
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}` });
        }

        if (topicChanged) {
            await channel.updatePartial({ set: { topic: channelTopic } }, { text: `Channel topic changed to ${channelTopic}` });
        }

        if (descriptionChanged) {
            await channel.updatePartial({ set: { description: channelDescription } }, { text: `Channel description changed to ${channelDescription}` });
        }

        if (selectedUsers.length) {
            await channel.addMembers(selectedUsers);
        }

        setChannelName(null);
        setChannelTopic('');
        setChannelDescription('');
        setIsEditing(false);
        setSelectedUsers([]);
    };

    const removeMember = async (userId) => {
        await channel.removeMembers([userId]);
        setCurrentMembers((prevMembers) => prevMembers.filter((member) => member !== userId));
    };

    return (
        <div className="edit-channel__container">
            <div className="edit-channel__header">
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>
            <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
            <ChannelTopicInput channelTopic={channelTopic} setChannelTopic={setChannelTopic} />
            <ChannelDescriptionInput channelDescription={channelDescription} setChannelDescription={setChannelDescription} />
            <UserList setSelectedUsers={setSelectedUsers} />
            <MemberList members={currentMembers} removeMember={removeMember} />
            <AdditionalSettings settings={settings} setSettings={setSettings} />
            <div className="edit-channel__button-wrapper" onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
        </div>
    );
};

export default EditChannelExtended;
