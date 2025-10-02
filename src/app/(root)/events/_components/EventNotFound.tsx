import React from "react";

type Props = {
  query?: string;
};

function EventNotFound({ query }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-3">
        {query ? (
          <>
            <h2 className="text-xl font-semibold">No events found</h2>
            <p className="text-muted-foreground">
              No events match your search for{" "}
              <span className=" text-destructive">"{query}"</span>. Try a
              different search term.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">No events available</h2>
            <p className="text-muted-foreground">
              There are no events to display at the moment. Check back later!
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default EventNotFound;
