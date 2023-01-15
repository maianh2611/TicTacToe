import './SideSelect.css'
function SideSelect(props) {
    return (
        <button className="btn btn-light choice-button" onClick={props.onClick}>{props.value}</button>
    )
}
export default SideSelect;