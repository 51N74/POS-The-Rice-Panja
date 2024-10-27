// Filter Component
const Filter = ({ label, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-600 focus:ring-green-600">
        {options.map((option, index) => <option key={index}>{option}</option>)}
      </select>
    </div>
  );

 export default Filter; 