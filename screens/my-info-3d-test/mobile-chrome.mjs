// Static presentation chrome requested for the two mobile previews, not live device data.
export function renderStatusBar(){
 return '<div class="mobile-status-bar" role="img" aria-label="시안용 상태 표시: 2시 38분, 네트워크, 와이파이, 배터리 83%. 실제 기기 정보가 아닙니다."><span class="mobile-status-time">2:38</span><span class="mobile-status-icons" aria-hidden="true"><svg width="20" height="14" viewBox="0 0 20 14"><rect x="1" y="9" width="3" height="4" rx="1"/><rect x="6" y="6" width="3" height="7" rx="1"/><rect x="11" y="3" width="3" height="10" rx="1"/><rect x="16" y="0" width="3" height="13" rx="1"/></svg><svg width="18" height="14" viewBox="0 0 18 14"><path d="M1 4a12 12 0 0 1 16 0M4 7a7.5 7.5 0 0 1 10 0M7 10a3 3 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="12.5" r="1"/></svg><svg class="mobile-status-battery" width="27" height="14" viewBox="0 0 27 14"><rect x=".5" y="1" width="23" height="12" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2.5" width="19" height="9" rx="2"/><path d="M25 5v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><text x="11.5" y="10" text-anchor="middle">83</text></svg></span></div>';
}
export function renderHomeIndicator(){
 return '<span class="mobile-home-indicator" aria-hidden="true"></span>';
}
