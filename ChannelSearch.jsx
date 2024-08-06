import React, { useState, useEffect, useCallback } from 'react';
import { useChatContext } from 'stream-chat-react';

import { ResultsDropdown } from './';
import { SearchIcon } from '../assets';

// Utility function to debounce the search input
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

/**
 * ChannelSearch component allows users to search for team channels and direct user channels.
 * It leverages the Stream Chat API to fetch channels and users based on the search query.
 *
 * @param {Function} setToggleContainer - Function to toggle the container visibility.
 */
const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]);

    /**
     * useEffect hook to clear channels when the query is empty.
     */
    useEffect(() => {
        if (!query) {
            setTeamChannels([]);
            setDirectChannels([]);
            setLoading(false);
        }
    }, [query]);

    /**
     * Fetches team channels and direct user channels from the Stream Chat API.
     *
     * @param {string} text - The search query.
     */
    const getChannels = async (text) => {
        try {
            setLoading(true);

            // Fetch team channels
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text },
                members: { $in: [client.userID] },
            });

            // Fetch direct user channels
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text },
            });

            const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

            // Update state with the fetched channels and users
            setTeamChannels(channels.length ? channels : []);
            setDirectChannels(users.length ? users : []);
        } catch (error) {
            console.error('Error fetching channels or users:', error);
            setQuery('');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the search input change.
     *
     * @param {Event} event - The input change event.
     */
    const onSearch = useCallback(
        debounce((event) => {
            const value = event.target.value.trim();
            setQuery(value);
            if (value) {
                getChannels(value);
            } else {
                setLoading(false);
            }
        }, 300),
        []
    );

    /**
     * Sets the active channel.
     *
     * @param {Object} channel - The channel to set as active.
     */
    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    };

    /**
     * Renders the ChannelSearch component.
     */
    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-search__input__icon">
                    <SearchIcon />
                </div>
                <input
                    className="channel-search__input__text"
                    placeholder="Search"
                    type="text"
                    value={query}
                    onChange={onSearch}
                />
            </div>
            {query && (
                <ResultsDropdown
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
        </div>
    );
};

export default ChannelSearch;

/**
 * Additional utility functions and components used within ChannelSearch.
 */

// Sample ResultsDropdown component for displaying search results
const ResultsDropdown = ({
    teamChannels,
    directChannels,
    loading,
    setChannel,
    setQuery,
    setToggleContainer,
}) => {
    return (
        <div className="results-dropdown">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {teamChannels.length > 0 && (
                        <div>
                            <p>Team Channels</p>
                            {teamChannels.map((channel) => (
                                <div
                                    key={channel.id}
                                    onClick={() => {
                                        setChannel(channel);
                                        setToggleContainer((prevState) => !prevState);
                                    }}
                                >
                                    {channel.name}
                                </div>
                            ))}
                        </div>
                    )}
                    {directChannels.length > 0 && (
                        <div>
                            <p>Direct Channels</p>
                            {directChannels.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => {
                                        setChannel(user);
                                        setToggleContainer((prevState) => !prevState);
                                    }}
                                >
                                    {user.name}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

/**
 * Sample SearchIcon component for displaying the search icon.
 */
const SearchIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.4765 18 14.256 17.268 15.5918 16.0432L19.2929 19.7443C19.6834 20.1348 20.3166 20.1348 20.7071 19.7443C21.0976 19.3538 21.0976 18.7206 20.7071 18.3301L17.006 14.629C18.2318 13.2932 19 11.5137 19 9.53723C19 5.39509 15.6421 2 11.5 2C10.9711 2 10.457 2.04618 9.95669 2.13477C9.46635 2.22183 9.00405 2.38684 8.58183 2.61529C8.15961 2.84373 7.78604 3.13224 7.47738 3.47144C7.16782 3.81064 6.9298 4.19863 6.77579 4.61762C6.62178 5.03661 6.55517 5.48093 6.58044 5.92527C6.60571 6.3696 6.72245 6.80843 6.92385 7.21579C7.12525 7.62314 7.40792 7.9915 7.75098 8.29663C8.09404 8.60175 8.48933 8.83798 8.91793 8.99556C9.34652 9.15315 9.80011 9.22907 10.2567 9.21992C10.7133 9.21076 11.1613 9.11681 11.583 8.94358C12.0048 8.77036 12.3938 8.52041 12.7293 8.20529C13.0649 7.89017 13.3412 7.51562 13.5452 7.09897C13.7492 6.68232 13.8771 6.23048 13.9214 5.76729C13.9656 5.3041 13.9246 4.8375 13.8006 4.39111C13.6766 3.94472 13.4717 3.52631 13.1977 3.16018C12.9238 2.79406 12.5885 2.48635 12.209 2.253C11.8295 2.01965 11.4137 1.86741 10.9838 1.80759C10.5539 1.74777 10.1195 1.78151 9.70444 1.90671C9.28941 2.03191 8.90363 2.24563 8.57395 2.5364C8.24428 2.82716 7.97926 3.18879 7.79574 3.59455C7.61222 4.00032 7.51315 4.44032 7.50576 4.88318C7.49837 5.32605 7.58272 5.767 7.75556 6.17973C7.9284 6.59245 8.18564 6.96686 8.51099 7.28234C8.83633 7.59783 9.22369 7.84742 9.64729 8.01495C10.0709 8.18247 10.5215 8.26421 10.9718 8.25521C11.4222 8.24621 11.8641 8.14694 12.279 7.96414C12.6939 7.78133 13.0738 7.51996 13.4005 7.19324C13.7272 6.86652 13.9957 6.48221 14.189 6.06182C14.3823 5.64143 14.4968 5.19183 14.5266 4.73374C14.5564 4.27565 14.5015 3.81439 14.3644 3.37371C14.2273 2.93302 14.0114 2.52149 13.7312 2.15726C13.4511 1.79304 13.1138 1.48503 12.7376 1.24712C12.3614 1.00922 11.9526 0.846331 11.5282 0.767832C11.1037 0.689332 10.6716 0.697055 10.2486 0.7906C9.82564 0.884145 9.41809 1.06111 9.04852 1.31145C8.67894 1.5618 8.35457 1.88017 8.09078 2.24635C7.827 2.61253 7.63036 3.01917 7.51277 3.44319C7.39518 3.86722 7.35902 4.3007 7.40625 4.73075C7.45347 5.1608 7.58346 5.58029 7.78878 5.96654C7.9941 6.3528 8.2708 6.69992 8.60571 6.98764C8.94063 7.27536 9.32743 7.49755 9.74532 7.64135C10.1632 7.78516 10.6045 7.84718 11.0424 7.82293C11.4802 7.79869 11.9083 7.68864 12.3066 7.49765C12.7048 7.30666 13.0654 7.0373 13.3733 6.70226C13.6812 6.36723 13.9298 5.9733 14.1064 5.5374C14.2831 5.10149 14.3845 4.6335 14.4056 4.15608C14.4267 3.67866 14.3668 3.1988 14.2297 2.7357C14.0926 2.2726 13.8814 1.83547 13.6075 1.44493C13.3335 1.05439 13.0028 0.718378 12.6334 0.451539C12.2639 0.1847 11.8636 0.00244391 11.4484 -0.0641363C11.0332 -0.130717 10.6131 -0.0809307 10.2126 0.0599614C9.8121 0.200853 9.43821 0.429118 9.11729 0.731131C8.79637 1.03314 8.53527 1.40229 8.34942 1.81358C8.16358 2.22488 8.05725 2.6682 8.03707 3.11962C8.01689 3
