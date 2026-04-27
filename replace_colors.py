import os

replacements = {
    "#F7941D": "#C0392B",
    "#f7941d": "#C0392B",
    "#E08319": "#A93226",
    "#e08319": "#A93226",
    "#0F1D3F": "#171717",
    "#0f1d3f": "#171717",
    "#091530": "#0A0A0A",
    "#091530": "#0A0A0A",
    "rgba(247, 148, 29": "rgba(192, 57, 43",
    "rgba(247,148,29": "rgba(192,57,43",
    "rgba(10, 25, 60": "rgba(23, 23, 23",
    "rgba(15, 29, 63": "rgba(23, 23, 23",
    "--color-navy:": "--color-black:",
    "--color-navy-dark:": "--color-black-dark:",
    "--color-amber:": "--color-red:",
    "--color-amber-hover:": "--color-red-hover:",
    "--color-amber-light:": "--color-red-light:",
    "var(--color-navy)": "var(--color-black)",
    "var(--color-navy-dark)": "var(--color-black-dark)",
    "var(--color-amber)": "var(--color-red)",
    "var(--color-amber-hover)": "var(--color-red-hover)",
    "var(--color-amber-light)": "var(--color-red-light)",
    "navy-tinted": "dark-tinted",
}

files_to_update = [
    "src/app/globals.css",
    "tailwind.config.ts",
    "src/app/page.tsx",
    "src/components/layout/Navbar.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/sections/Hero.tsx",
    "src/components/sections/Services.tsx",
    "src/components/sections/WhyUs.tsx",
    "src/components/sections/PcbQuality.tsx",
    "src/components/sections/Addons.tsx",
    "src/components/sections/Process.tsx",
    "src/components/sections/Contact.tsx",
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    with open(file_path, 'w') as f:
        f.write(new_content)
        
print("Replacement complete.")
