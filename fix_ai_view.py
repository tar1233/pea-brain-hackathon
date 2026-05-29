import sys

file_path = "src/app/components/AIVendorStrategyView.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Remove the Header div
start_header = "      {/* Header */}"
end_header = '      <div className="max-w-6xl mx-auto space-y-6">'

start_idx = content.find(start_header)
end_idx = content.find(end_header)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + content[end_idx:]
    # Also change the top div padding and margin
    new_content = new_content.replace('<div className="bg-white text-slate-800 p-6 md:p-8 rounded-2xl mt-8 border border-slate-200 shadow-sm overflow-hidden">', '<div className="bg-transparent text-slate-800 mt-6">')
    with open(file_path, "w") as f:
        f.write(new_content)
    print("Fixed header in AIVendorStrategyView")
else:
    print("Could not find header")

