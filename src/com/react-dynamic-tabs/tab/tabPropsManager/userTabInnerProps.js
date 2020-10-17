const UserTabInnerProps = {
    get: function ({ id, isSelected, api }) {
        return { id, isSelected, api: api.userProxy };
    }
};
export default UserTabInnerProps;