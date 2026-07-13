# Obsidian MCP LocalTunnel Watchdog
# Runs localtunnel in an infinite loop so if it crashes, it restarts immediately.
$Subdomain = "rappd-obsidian-secondbrain"
$Port = 27123

Write-Host "Starting Localtunnel Watchdog for Obsidian MCP..."
Write-Host "Subdomain: $Subdomain"
Write-Host "Port: $Port"

while ($true) {
    Write-Host "Launching localtunnel..."
    # Call npx localtunnel and wait for it to exit
    npx localtunnel --port $Port --subdomain $Subdomain
    Write-Host "Localtunnel exited or crashed. Restarting in 5 seconds..."
    Start-Sleep -Seconds 5
}
