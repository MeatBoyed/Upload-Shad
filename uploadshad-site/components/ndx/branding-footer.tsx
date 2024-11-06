export default function BrandingFooter() {
  return (
    <div className="w-full  min-h-fit flex justify-center items-center flex-col gap-5">
      <div className="flex justify-center items-center flex-col">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Powered by</h3>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-[#00AAFF] ">
          Nerf Designs
        </h2>
        <div className="leading-7">Nerf your competition</div>
      </div>

      <p className="leading-7 text-center">
        Copyright © {new Date().getFullYear()} Nerf Designs. All Rights Reserved
      </p>
    </div>
  );
}
