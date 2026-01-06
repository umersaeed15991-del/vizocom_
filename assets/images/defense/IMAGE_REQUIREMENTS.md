# Defense Section Carousel - Image Requirements

This document lists the images needed for the 5-industry carousel section.

## Image Specifications
- **Location**: `assets/images/defense/`
- **Recommended Size**: 1920x1080px or larger (will be cropped/covered)
- **Format**: JPG or PNG
- **Aspect Ratio**: 16:9 or similar landscape orientation

## Required Images

### 1. Defense / Military ✅ (Already Available)
- **Filename**: `defense_military_left.png`
- **Status**: ✅ Already in use
- **Description**: Soldiers connecting (preferably with their families)
- **Scenario**: Military personnel in field connecting to mission command, ideally showing connection with families

### 2. Oil & Gas / Energy ⏳ (Needed)
- **Filename**: `oil_gas_rig.jpg`
- **Status**: ⏳ Placeholder CSS gradient in use
- **Description**: Men working on oil rigs (close-up of workers)
- **Scenario**: Workers on oil rigs connecting to operational control centers
- **Visual**: Close-up of workers on rig, industrial setting

### 3. Humanitarian / NGO ⏳ (Needed)
- **Filename**: `humanitarian_aid.jpg`
- **Status**: ⏳ Placeholder CSS gradient in use
- **Description**: Humanitarian case with people helping - medics helping
- **Scenario**: Aid workers and medics helping people in need, connecting to life-saving resources
- **Visual**: Medical professionals, aid workers, people receiving help

### 4. Government / Public Sector ⏳ (Needed)
- **Filename**: `government_embassy.jpg`
- **Status**: ⏳ Placeholder CSS gradient in use
- **Description**: Embassy with people in their offices
- **Scenario**: Embassy or government offices with people working, connecting border posts to central intelligence
- **Visual**: Modern embassy/government office interior, people working at desks

### 5. Enterprise / Remote Business ⏳ (Needed)
- **Filename**: `enterprise_remote.jpg`
- **Status**: ⏳ Placeholder CSS gradient in use
- **Description**: Enterprise/remote business setting
- **Scenario**: Field offices connected to global networks
- **Visual**: Modern office, remote workers, business professionals, network infrastructure

## Current Status

The carousel is fully functional with:
- ✅ Defense/Military image working
- ⏳ Other industries using CSS gradient placeholders until images are added

## How It Works

1. The JavaScript automatically detects if an image file exists
2. If the image loads successfully, it displays the image
3. If the image fails to load, it falls back to a themed CSS gradient placeholder
4. Once you add the image files with the correct names, they will automatically be used

## Adding Images

Simply place the image files in `assets/images/defense/` with the exact filenames listed above. The carousel will automatically detect and use them.

