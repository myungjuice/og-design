import {renderMileage} from '../components/mileage.mjs';

export function renderProfileBalance(props){
 return '<div class="profile-balance">'+renderMileage({...props,showSharedAmount:false})+'</div>';
}
