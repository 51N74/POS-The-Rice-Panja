const RowsPerPage = ({ options }) => (
    <div>
      <label className="text-gray-700 mr-2">Rows per page:</label>
      <select className="border-gray-300 rounded-md shadow-sm focus:border-green-600 focus:ring-green-600">
        {options.map((option, index) => <option key={index}>{option}</option>)}
      </select>
    </div>
  );
  export default RowsPerPage