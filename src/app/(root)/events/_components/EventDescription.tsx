type Props = {
  description: string;
};

function EventDescription({ description }: Props) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground mb-2 border-b  pb-1">
        Description
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
        <span className="text-secondary-foreground font-semibold hover:underline">
          Read More
        </span>
      </p>
    </section>
  );
}

export default EventDescription;
