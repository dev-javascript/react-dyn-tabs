export default function ({ id, isSelected }) {
    return { isSelected, id, api: this.userProxy }
};