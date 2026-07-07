const fs = require('fs');
const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

const newNavigation = `
            <!-- Sidebar Navigation (Desktop) -->
            <nav class="sidebar-nav">
                <div class="sidebar-brand">STATE NOT FATE</div>
                
                <div class="sidebar-group">
                    <div class="sidebar-group-title">Home</div>
                    <button class="nav-item active" data-tab="dashboard">
                        <span style="font-size: 1.1rem;">⌂</span> Dashboard
                    </button>
                    <button class="nav-item" data-tab="polaris">
                        <span style="font-size: 1.1rem;">🜁</span> Polaris
                    </button>
                </div>
                
                <div class="sidebar-group">
                    <div class="sidebar-group-title">Momentum</div>
                    <button class="nav-item" data-tab="momentum">
                        <span style="font-size: 1.1rem;">📊</span> Stats & Audit
                    </button>
                    <button class="nav-item" data-tab="progression">
                        <span style="font-size: 1.1rem;">📈</span> Progression
                    </button>
                </div>
                
                <div class="sidebar-group">
                    <div class="sidebar-group-title">Library</div>
                    <button class="nav-item" data-tab="cognitivelab">
                        <span style="font-size: 1.1rem;">📝</span> Worksheets
                    </button>
                    <button class="nav-item" data-tab="documentcenter">
                        <span style="font-size: 1.1rem;">📁</span> Document Center
                    </button>
                    <button class="nav-item" data-tab="mediaconsole">
                        <span style="font-size: 1.1rem;">🎧</span> Media Console
                    </button>
                    <button class="nav-item" data-tab="explorer">
                        <span style="font-size: 1.1rem;">🔍</span> Explorer
                    </button>
                </div>
                
                <div class="sidebar-group">
                    <div class="sidebar-group-title text-red">Crisis & Safety</div>
                    <button class="nav-item" data-tab="safebox" id="btn-tab-safebox" style="color: var(--accent-orange);">
                        <span style="font-size: 1.1rem;">⚠</span> Crisis Safe Box
                    </button>
                    <button class="nav-item" data-tab="suicideprevention" style="color: var(--accent-orange);">
                        <span style="font-size: 1.1rem;">🎗️</span> Suicide Prevention
                    </button>
                </div>
                
                <div style="flex: 1;"></div>
                
                <div class="sidebar-group" style="margin-bottom: 0;">
                    <button class="nav-item" id="btn-tab-lock">
                        <span style="font-size: 1.1rem;">🔒</span> Lock App
                    </button>
                    <button class="nav-item" data-tab="reset-intake" id="btn-tab-reset">
                        <span style="font-size: 1.1rem;">⚙</span> Reset Intake
                    </button>
                </div>
            </nav>

            <!-- Bottom Navigation (Mobile) -->
            <nav class="bottom-nav">
                <button class="nav-item active" data-tab="dashboard">
                    <span style="font-size: 1.25rem;">⌂</span>
                    <span>Home</span>
                </button>
                <button class="nav-item" data-tab="momentum">
                    <span style="font-size: 1.25rem;">📊</span>
                    <span>Stats</span>
                </button>
                <button class="nav-item" data-tab="documentcenter">
                    <span style="font-size: 1.25rem;">📁</span>
                    <span>Library</span>
                </button>
                <button class="nav-item" data-tab="safebox">
                    <span style="font-size: 1.25rem; color: var(--accent-orange);">⚠</span>
                    <span style="color: var(--accent-orange);">Safety</span>
                </button>
                <button class="nav-item" data-tab="reset-intake">
                    <span style="font-size: 1.25rem;">⚙</span>
                    <span>Settings</span>
                </button>
            </nav>

            <!-- Main Content Area -->
            <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
`;

const tabStartStr = '<div class="app-tabs">';
const tabStart = html.indexOf(tabStartStr);
const tabEndStr = '<button class="tab-btn" data-tab="reset-intake" id="btn-tab-reset" style="margin-left: auto; color: var(--text-muted);">Reset Intake</button>\n            </div>';
const tabEnd = html.indexOf(tabEndStr) + tabEndStr.length;

if (tabStart !== -1 && html.indexOf(tabEndStr) !== -1) {
    html = html.substring(0, tabStart) + newNavigation + html.substring(tabEnd);
} else {
    console.log("Could not find app-tabs exactly");
}

html = html.replace('    <script src="app.js"></script>', '            </div>\n    <script src="app.js"></script>');
html = html.replace('<div id="screen-dashboard" class="hidden">', '<div id="screen-dashboard" class="hidden" style="display: flex; min-height: 100vh;">');

fs.writeFileSync(path, html);
console.log('index.html updated successfully with new navigation.');
