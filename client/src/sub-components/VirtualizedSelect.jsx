import Select from 'react-select';
import { FixedSizeList } from 'react-window';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';

const MenuList = ({ children, maxHeight }) => {
  const itemCount = children.length;
  const itemSize = 35; // Adjust the height of each option item as needed

  return (
      <FixedSizeList height={maxHeight} itemCount={itemCount} itemSize={itemSize}>
          {({ index, style }) => <div style={style}>{children[index]}</div>}
      </FixedSizeList>
  );
};

MenuList.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.number.isRequired
};

export default function VirtualizedSelect({ options, value, onChange, placeholder, customStyles }) {

    return (
        <Select
            styles={customStyles}
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            components={{ MenuList, DropdownIndicator: () => <SearchIcon /> }}
            isClearable
            isSearchable
        />
    );
}


VirtualizedSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  customStyles: PropTypes.object
};
