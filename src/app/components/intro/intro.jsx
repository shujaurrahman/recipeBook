export default function Intro() {
  return (
    <div className="md:grid md:grid-cols-2 md:py-20 md:max-w-screen-lg md:px-8 md:pt-32 sm:grid-cols-1 sm:px-4 sm:pt-32">
      <div>
        <p className="text-sm text-slate-800 mb-2">
          Julia Child once said, <i>"No one is born a great cook, one learns by doing."</i>
        </p>
        <p className="text-sm text-slate-800">
          Welcome to Recipe Book! Discover delicious recipes from around the world. 
          Click on any recipe card to view detailed instructions and ingredients.
        </p>
        <p className="text-sm pt-8 text-slate-800">
          Powered by{" "}
          <a
            className="hover:text-slate-500"
            href="https://spoonacular.com/food-api"
            target="_blank"
            rel="noreferrer"
          >
            Spoonacular API
          </a>
        </p>
      </div>
    </div>
  );
}
