# Set variables
$repoUrl = "https://github.com/historybuffjb/stevie-scoreboard.git"
$installDir = "C:\\stevie-scoreboard"
$nodeInstaller = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
$serviceName = "StevieScoreboard"
$serverScript = "src\\server.ts"
$port = 3000

# Install Node.js if not present
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Installing..."
    Invoke-WebRequest $nodeInstaller -OutFile "$env:TEMP\\nodejs.msi"
    Start-Process msiexec.exe -Wait -ArgumentList "/I $env:TEMP\\nodejs.msi /quiet"
}

# Clone repo
if (-not (Test-Path $installDir)) {
    git clone $repoUrl $installDir
}

# Install dependencies
cd $installDir
npm install

# Create a script to start the server and launch browser
$startScript = @"
cd $installDir
npm run start
Start-Sleep -Seconds 5
Start-Process \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" \"http://localhost:$port/public/index.html\" --kiosk
"@
$startScriptPath = "$installDir\\start-scoreboard.ps1"
$startScript | Set-Content $startScriptPath

# Create a scheduled task to run at startup
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$startScriptPath`""
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName $serviceName -Action $action -Trigger $trigger -Principal $principal -Force

Write-Host "Setup complete. The scoreboard will run as a service and launch in kiosk mode on startup."