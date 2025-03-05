# Set the environment mode based on an argument passed to the script
$env:ENV_MODE = "test"  # Default to development

if ($args[0] -eq "test") {
    $env:ENV_MODE = "test"
} elseif ($args[0] -eq "production") {
    $env:ENV_MODE = "production"
}

Write-Host "Using environment mode: $env:ENV_MODE"

# Build Docker images with the correct environment mode
docker-compose build

# Run Docker containers with the correct environment file
docker-compose up --build