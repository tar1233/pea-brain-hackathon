import sys

file_path = "src/app/components/ProjectRoadmap.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix Row 1 Grid
content = content.replace(
    '<div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">',
    '<div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">'
)

# Fix Row 2 Grid
content = content.replace(
    '<div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start mb-6">',
    '<div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center lg:items-start mb-6">'
)

# Fix Row 3 Grid
content = content.replace(
    '<div className="grid grid-cols-3 gap-6">',
    '<div className="grid grid-cols-1 md:grid-cols-3 gap-6">'
)

# Hide dashed lines on mobile
content = content.replace(
    '<div className="absolute top-1/2 -left-[60px] w-[60px] h-px border-t-2 border-dashed border-slate-300" />',
    '<div className="hidden lg:block absolute top-1/2 -left-[60px] w-[60px] h-px border-t-2 border-dashed border-slate-300" />'
)
content = content.replace(
    '<div className="absolute top-1/2 -right-[60px] w-[60px] h-px border-t-2 border-dashed border-slate-300" />',
    '<div className="hidden lg:block absolute top-1/2 -right-[60px] w-[60px] h-px border-t-2 border-dashed border-slate-300" />'
)
content = content.replace(
    '<div className="w-px h-8 border-l-2 border-dashed border-slate-300" />',
    '<div className="hidden lg:block w-px h-8 border-l-2 border-dashed border-slate-300" />'
)

content = content.replace(
    '<div className="w-full h-px border-t-2 border-dashed border-slate-300" />',
    '<div className="hidden lg:block w-full h-px border-t-2 border-dashed border-slate-300" />'
)

with open(file_path, "w") as f:
    f.write(content)

print("Roadmap Patched")
