[CmdletBinding()]
param(
    [ValidateSet("Medium_Phone", "Scheduler_API_33")]
    [string]$AvdName = "Medium_Phone",
    [switch]$NoPackager,
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$workspaceRoot = Split-Path -Parent $projectRoot
$localSdk = Join-Path $workspaceRoot ".tooling\android-sdk"
$localAvdHome = Join-Path $workspaceRoot ".tooling\avd"
$userSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$userAvdHome = Join-Path $env:USERPROFILE ".android\avd"
$jdkRoot = Join-Path $workspaceRoot ".tooling\jdk17"
$javaHome = Get-ChildItem -LiteralPath $jdkRoot -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "jdk-17*" } |
    Sort-Object Name -Descending |
    Select-Object -First 1 -ExpandProperty FullName

if (-not $javaHome -or -not (Test-Path -LiteralPath (Join-Path $javaHome "bin\java.exe"))) {
    throw "No se encontro el JDK 17 local en $jdkRoot."
}

$adb = Join-Path $localSdk "platform-tools\adb.exe"
$localEmulator = Join-Path $localSdk "emulator\emulator.exe"
$userEmulator = Join-Path $userSdk "emulator\emulator.exe"

foreach ($requiredPath in @(
    $adb,
    (Join-Path $localSdk "platforms\android-33\android.jar"),
    (Join-Path $localSdk "build-tools\33.0.0"),
    (Join-Path $localSdk "ndk\23.1.7779620")
)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Falta un componente Android requerido: $requiredPath"
    }
}

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $localSdk
$env:ANDROID_SDK_ROOT = $localSdk
$env:GRADLE_USER_HOME = Join-Path $env:USERPROFILE ".gradle"
$env:Path = @(
    (Join-Path $javaHome "bin"),
    (Join-Path $localSdk "platform-tools"),
    (Join-Path $localSdk "emulator"),
    (Join-Path $localSdk "cmdline-tools\latest\bin"),
    $env:Path
) -join ";"

function Get-OnlineDevice {
    $lines = & $adb devices 2>$null
    foreach ($line in $lines) {
        if ($line -match "^(\S+)\s+device$") {
            return $Matches[1]
        }
    }
    return $null
}

function Wait-ForAndroidDevice {
    param([int]$TimeoutSeconds = 180)

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        $serial = Get-OnlineDevice
        if ($serial) {
            $bootCompleted = (& $adb -s $serial shell getprop sys.boot_completed 2>$null).Trim()
            if ($bootCompleted -eq "1") {
                return $serial
            }
        }
        Start-Sleep -Seconds 2
    } while ((Get-Date) -lt $deadline)

    throw "El emulador no termino de iniciar en $TimeoutSeconds segundos."
}

& $adb start-server | Out-Null
$deviceId = Get-OnlineDevice

if (-not $deviceId) {
    if ($AvdName -eq "Medium_Phone") {
        $avdIni = Join-Path $userAvdHome "$AvdName.ini"
        if (-not (Test-Path -LiteralPath $avdIni)) {
            throw "No existe el AVD $AvdName en $userAvdHome."
        }
        if (-not (Test-Path -LiteralPath $userEmulator)) {
            throw "No se encontro el emulador de Android Studio en $userEmulator."
        }
        $env:ANDROID_AVD_HOME = $userAvdHome
        Write-Host "Iniciando el emulador $AvdName..." -ForegroundColor Cyan
        Start-Process -FilePath $userEmulator -ArgumentList @("-avd", $AvdName, "-no-snapshot-load") | Out-Null
    } else {
        $avdIni = Join-Path $localAvdHome "$AvdName.ini"
        if (-not (Test-Path -LiteralPath $avdIni)) {
            throw "No existe el AVD $AvdName en $localAvdHome."
        }
        $env:ANDROID_AVD_HOME = $localAvdHome
        Write-Host "Iniciando el emulador $AvdName..." -ForegroundColor Cyan
        Start-Process -FilePath $localEmulator -ArgumentList @("-avd", $AvdName, "-no-snapshot-load") | Out-Null
    }

    $deviceId = Wait-ForAndroidDevice
} else {
    $deviceId = Wait-ForAndroidDevice -TimeoutSeconds 60
}

$androidVersion = (& $adb -s $deviceId shell getprop ro.build.version.release 2>$null).Trim()
$pageSize = (& $adb -s $deviceId shell getconf PAGESIZE 2>$null).Trim()
Write-Host "Emulador detectado: $deviceId (Android $androidVersion, pagina $pageSize bytes)." -ForegroundColor Green

if ($pageSize -eq "16384") {
    Write-Warning "Medium_Phone usa paginas de 16 KB. React Native 0.72 puede mostrar una advertencia de compatibilidad. Para la ejecucion estable usa: npm.cmd run android:api33"
}

& $adb -s $deviceId reverse tcp:8081 tcp:8081 | Out-Null

if ($CheckOnly) {
    Write-Host "Entorno Android listo; no se solicito compilar la aplicacion." -ForegroundColor Green
    exit 0
}

$reactNativeArgs = @(
    "--no-install",
    "react-native",
    "run-android",
    "--deviceId",
    $deviceId,
    "--active-arch-only"
)
if ($NoPackager) {
    $reactNativeArgs += "--no-packager"
}

Push-Location $projectRoot
try {
    Write-Host "Compilando e instalando Scheduler en $deviceId..." -ForegroundColor Cyan
    & npx.cmd @reactNativeArgs
    if ($LASTEXITCODE -ne 0) {
        throw "React Native termino con codigo $LASTEXITCODE."
    }
} finally {
    Pop-Location
}

Write-Host "Scheduler quedo instalada y abierta en $deviceId." -ForegroundColor Green
